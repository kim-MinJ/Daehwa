import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const PrivateRoute = ({ requiredRole }) => {
  const { isLoggedIn, userRole } = useContext(AuthContext);

  // 로그인이 되어 있지 않으면 로그인 페이지로 리디렉션
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 역할(role)이 필요한데, 현재 사용자의 역할과 일치하지 않으면 권한 없음 페이지로 리디렉션
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 모든 조건이 충족되면 자식 컴포넌트 렌더링
  return <Outlet />;
};

export default PrivateRoute;