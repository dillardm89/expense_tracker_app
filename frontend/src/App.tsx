import { BrowserRouter as Router } from 'react-router-dom'
import MainRoutes from './shared/components/main/MainRoutes'
import '../public/styles/index.css'


/**
 * Page for rendering main App
 * @returns {React.JSX.Element}
 */
function App(): React.JSX.Element {

  return (
    <>
      <Router>
        <MainRoutes />
      </ Router >
    </>
  )
}

export default App
