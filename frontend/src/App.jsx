import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './component/header'
import CalendarPage from './pages/calender'
import WritePage from './pages/writeDiary'
import ReadPage from './pages/readDiary'

const App = () => {
  return(
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<CalendarPage />} />
        <Route path='/write' element={<WritePage />}/>
<<<<<<< HEAD
=======
        <Route path='/read' element={<ReadPage />}/>
>>>>>>> 57137bccc9b5ddc674abc30b2fcf0392e928e979
        <Route path='/day/:date' element={<ReadPage />}/>
      </Routes>
    </BrowserRouter>
  )
}
export default App;