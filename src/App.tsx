import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Template from 'component/Template';
import HomeScreen from 'screen/HomeScreen';
import NotFoundScreen from 'screen/NotFoundScreen';
// import UnavailableScreen from 'screen/UnavailableScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Template/>}>
          <Route index element={<HomeScreen/>} />
        </Route>
        <Route path="*" element={<NotFoundScreen/>} />
      </Routes>
    </Router>
  )
}

export default App;