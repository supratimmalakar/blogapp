import '../styles/globals.css'
import { store } from '../redux/index'
import { Provider } from 'react-redux'
import Toast from '../components/Toast'

function MyApp({ Component, pageProps }) {

  return (
    <Provider store={store}>
      <Toast/>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
