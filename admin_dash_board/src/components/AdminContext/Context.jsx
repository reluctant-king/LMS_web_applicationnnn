import axios from "axios";
import React, { useEffect, useState } from "react";

export const AdminContext = React.createContext();

const Context = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    loading: true
  });

  const [admin, setAdmin] = useState(null);

  const isAdminLogedIn = (value) => {
    setAuth({ isAuthenticated: value, loading: false });
  };

  const getAdmin = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/getInstitutionAdmin`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setAdmin(res.data.instituteAdmin);
        setAuth({ isAuthenticated: true, loading: false });
      } else {
        setAuth({ isAuthenticated: false, loading: false });
      }
    } catch (err) {
      setAuth({ isAuthenticated: false, loading: false });
    }
  };

  useEffect(() => {
    getAdmin(); // check login on refresh
  }, []);

  return (
    <AdminContext.Provider
      value={{ auth, admin, isAdminLogedIn }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default Context;
