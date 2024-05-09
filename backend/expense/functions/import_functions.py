import re
from base64 import b64decode
from datetime import (datetime, timezone)
from rest_framework import status
from dashboard.functions.category import get_category_id
from .views_functions import create_expenses_for_import
from ..utils.responses import (parse_csv_success,
                               parse_csv_failed)


DATE_REGEX = r"^(0[1-9]|1[0-2])[/](0[1-9]|[12]\d|3[01])[/](19\d\d|20\d\d)$"
AMOUNT_STRING_REGEX = r"^[($-]*[0-9]+([.][0-9]{1,2})?[)]?$"
AMOUNT_FLOAT_REGEX = r"[0-9]+[.]?[0-9]{1,2}"
QUOTED_STRING_REGEX = r'"[^"]*(?:""[^"]*)*"'
SKIP_WORDS_LIST = ['deposit', 'debit', 'credit', 'withdrawal',
                   'sale', 'return', 'adjustment', 'payment', 'transfer',
                   'income', 'reward', 'rewards', 'cash', 'dividend',
                   'check', 'POS', 'expense', 'cleared', 'posted',
                   'pending', 'interest', 'refund', 'refunded', 'dispute',
                   'disputed', 'adjust', 'fee']


def decode_data_file(data: str, has_heading: bool, userId: str) -> None:
    ''' decode_data_file: function to decode base64 string of imported
            expense file data then create new Expense instances

        Args:
            data (str): base64 string of expense file data to be imported
            has_heading (bool): whether file contains a heading row
            userId (str): id for associated User instance

        Returns:
            list: list containing a human-readable response
                message and a 'status' integer with standard
                Http status code
    '''
    try:
        decoded_data: str = b64decode(data.split(',')[1]).decode('utf-8')

        # Remove extra whitespace within string
        decoded_data = re.sub(' +', ' ', decoded_data)

        # Remove newline character with multiline string
        decoded_data = re.sub(QUOTED_STRING_REGEX,
                              lambda match: match.group(0).replace("\n", " "),
                              decoded_data)

        split_decoded: list = decoded_data.split('\n')
        length_split: int = len(split_decoded)
    except Exception:
        return [parse_csv_failed, status.HTTP_400_BAD_REQUEST]

    if has_heading:
        body: list = split_decoded[1:length_split]
    else:
        body: list = split_decoded

    if len(body) == 0:
        return [parse_csv_failed, status.HTTP_400_BAD_REQUEST]

    new_expenses: list = parse_data(body, userId)
    if len(new_expenses) == 0:
        return [parse_csv_failed, status.HTTP_400_BAD_REQUEST]

    response = create_expenses_for_import(new_expenses)
    if response[1] != 200:
        return [parse_csv_failed, status.HTTP_400_BAD_REQUEST]
    return [parse_csv_success, status.HTTP_200_OK]


def parse_data(body: list, userId: str) -> list:
    ''' parse_data: function to parse data extracting values
            to create new Expense objests

        Args:
            body (list): list of strings containing row data from
                csv file body (stripped of heading row)
            userId (str): id for associated User instance

        Returns:
            list: list containing Expense type objects
    '''
    new_expenses: list = []
    for row in body:
        row: str
        # Remove quotes and carriage characters, split string into list
        split_row: list = row.replace('"', '').replace("'", '').replace(
            '\r', '').split(',')

        # Remove empty cells in row
        prune_row: list = list(filter(None, split_row))
        if len(prune_row) == 0:
            continue

        # Find date then convert to datetime
        spend_date: datetime
        [spend_date, prune_row] = find_date_string(prune_row)

        # Find amount then covert to float and get type value
        amount: float
        type: int
        [amount, type, prune_row] = find_amount_string(prune_row)
        if len(str(amount)) == 0:
            continue

        # Find vendor and category strings then trim length
        vendor: str
        category: str
        [vendor, category] = find_vendor_category(prune_row)
        if len(vendor) == 0:
            continue

        # Check for existing category by name or create new
        categoryId: str | None = None
        if len(category) > 0:
            categoryId = get_category_id(category, userId)

        expense: dict = {'vendor': vendor, 'amount': amount, 'type': type,
                         'spend_date': spend_date, 'user': userId,
                         'date_created': datetime.now(tz=timezone.utc).replace(
                             microsecond=0)}
        if categoryId is not None:
            expense['category'] = categoryId
        new_expenses.append(expense)
    return new_expenses


def find_date_string(data: list) -> list:
    ''' find_date_string: function to find date string in
            list by matching regex of data format 'mm/dd/yyyy'

        Args:
            data (list): list of strings for single row of data
                from csv file

        Returns:
            list: list containing spend_date as datetime
                and data list after matching date strings removed
    '''
    match_list: list = []
    index_list: list = []
    for index, item in enumerate(data):
        match = re.search(DATE_REGEX, item)
        if match is not None:
            match_list.append(match.group())
            index_list.append(index)

    adjust: int = 0
    for index in index_list:
        del data[index-adjust]
        adjust += 1

    if len(match_list) == 0:
        return ['', data]
    date_string: str = match_list[0]
    spend_date: datetime = get_spend_date(date_string)
    return [spend_date, data]


def get_spend_date(date: str) -> datetime:
    ''' get_spend_date: function to convert date
            string to datetime

        Args:
            date (str): date formatted 'mm/dd/yyyy'

        Returns:
            spend_date (datetime): utc formatted datetime object
    '''
    date_string: str = (date + ' 00:00:00.000 +0000')
    spend_date: datetime = datetime.strptime(date_string,
                                             '%m/%d/%Y %H:%M:%S.%f %z')
    return spend_date


def find_amount_string(data: list) -> list:
    ''' find_amount_string: function to find amount string in
            list by matching regex of currency formats
            ex: ($000.00), $-000.00, (000.00), $000.00,
                000, 000.00, .00

        Args:
            data (list): list of strings for single row of data
                from csv file

        Returns:
            list: list containing amount as float, type as int,
                and data list after matching amount strings removed
    '''
    match_list: list = []
    index_list: list = []
    for index, item in enumerate(data):
        match = re.search(AMOUNT_STRING_REGEX, item)
        if match is not None:
            match_list.append(match.group())
            index_list.append(index)

    adjust: int = 0
    for index in index_list:
        del data[index-adjust]
        adjust += 1

    amount: float
    type: int
    if len(match_list) == 0:
        return ['', '', data]
    amount_string: str = match_list[0]
    [amount, type] = get_amount_type(amount_string)
    return [amount, type, data]


def get_amount_type(amount: str) -> list:
    ''' get_amount_type: function to convert amount
            string to float and extract type value
            (0=Deposit, 1=Withdrawal)

        Args:
            amount (str): currency or number string

        Returns:
            list: list containing amount_num as float
                and amount_type as int
    '''
    amount_type: int = 0  # 0=Deposit for positive number
    open_parenth: int = amount.find('(')
    negative: int = amount.find('-')

    if open_parenth != -1 or negative != -1:
        amount_type = 1  # 1=Withdrawal for negative number

    amount_list = re.findall(AMOUNT_FLOAT_REGEX, amount)
    if len(amount_list) == 0:
        return ['', '']
    amount_num: float = float(amount_list[0])
    return [amount_num, amount_type]


def find_vendor_category(data: list) -> list:
    ''' find_vendor_category: function to find vendor and
            category strings in list by matching regex

        Args:
            data (list): list of strings for single row of data
                from csv file

        Returns:
            list: list containing vendor and category as strings
    '''
    regex_list: list = [DATE_REGEX, AMOUNT_STRING_REGEX]
    index_list: list = []
    for index, item in enumerate(data):
        # Remove strings less than 2 characters
        if len(item) < 2:
            index_list.append(index)
            continue

        # Remove strings matching transaction words
        deleted: bool = False
        for word in SKIP_WORDS_LIST:
            if item.lower() == word.lower():
                deleted = True
                index_list.append(index)
                break
        if deleted:
            continue

        # Remove strings matching date/amount patterns
        for pattern in regex_list:
            match = re.search(pattern, item)
            if match is not None:
                index_list.append(index)
                break

    adjust: int = 0
    for index in index_list:
        del data[index-adjust]
        adjust += 1

    count: int = len(data)
    if count == 0:
        return ['', '']

    vendor_string: str = data[0]
    vendor: str = get_trimmed_vendor(vendor_string)
    if count == 1:
        return [vendor, '']
    else:
        category_string: str = data[count-1]
        category: str = get_trimmed_category(category_string)
        return [vendor, category]


def get_trimmed_vendor(name: str) -> str:
    ''' get_trimmed_vendor: function to clean string
            for vendor field

        Args:
            name (str): vendor name

        Returns:
            vendor (str): cleaned and trimmed string
    '''
    allowed_length: int = 100
    vendor: str = re.sub(' +', ' ', name)
    if len(vendor) > allowed_length:
        vendor = vendor[0:allowed_length]
    return vendor


def get_trimmed_category(name: str) -> str:
    ''' get_trimmed_category: function to clean string
            for category name

        Args:
            name (str): category name

        Returns:
            category (str): cleaned and trimmed string
    '''
    allowed_length: int = 50
    category: str = re.sub(' +', ' ', name)
    if len(category) > allowed_length:
        category = category[0:allowed_length]
    return category
