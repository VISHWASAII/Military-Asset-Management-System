import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import MilitaryLandingPage from './Pages/LandingPage';
import InventoryDashboard from './Pages/DashboardPage';
import PurchasePage from './Pages/PurchasePage';
import TransferPage from './Pages/TransferPage';
import ExpenditurePage from './Pages/ExpenditurePage';
import AssignmentPage from './Pages/AssignmentPage';
import AssetPage from './Pages/AssetPage';
import LogPage from './Pages/LogPage';
import BasePage from './Pages/BasePage';
import './index.css'



function App() {

  return (
    <Router>
      <Routes>
        <Route path='/loginPage' element={<LoginPage/>}/>
        <Route path='/' element={<MilitaryLandingPage/>}/>
        <Route path='/dashboardPage' element={<InventoryDashboard/>}/>
        <Route path='/purchasePage' element={<PurchasePage/>}/>
        <Route path='/transferPage' element={<TransferPage/>}/>
        <Route path='/expenditurePage' element={<ExpenditurePage/>}/>
        <Route path='/assignmentPage' element={<AssignmentPage/>}/>
        <Route path='/assetPage' element={<AssetPage/>}/>
        <Route path='/basePage' element={<BasePage/>}/>
        <Route path='/logPage' element={<LogPage/>}/>
      </Routes>
    </Router>
  )
}

export default App
