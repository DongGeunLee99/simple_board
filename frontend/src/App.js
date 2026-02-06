import './App.css';
import React from 'react'
import { createBrowserRouter, Outlet } from 'react-router-dom';

import Main from './pages/Main';
import Detail from './pages/Detail';
import Search from './pages/Search';
import Create from './pages/Create';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import MyPage from './pages/MyPage';


function App() {

  return (
    <div className="App">
      <Outlet />
    </div>

  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Main /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'detail/:postId', element: <Detail /> },
      { path: 'create', element: <Create /> },
      { path: 'create/:postId', element: <Create /> },
      { path: 'search/:text/:type', element: <Search /> },
      { path: 'mypage', element: <MyPage /> },
      { path: 'mypage/signup/:userId', element: <SignUp /> },
    ],
  },
]);

export default App;