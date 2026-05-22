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
        <Route path='/read' element={<ReadPage />}/>
        <Route path='/day/:date' element={<ReadPage />}/>
      </Routes>
    </BrowserRouter>
  )
}
export default App;