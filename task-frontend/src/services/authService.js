import instance from "./instance";

const authServices = {
    register: async (userData) => {
        return await instance.post('/api/users/register', userData);
    },
    login: async (userData) => {
       
        return await instance.post('/api/users/login', userData);
    },
    getProfile: async () => {
         const token = localStorage.getItem('token');
    return await instance.get(`/api/users/profile` ,

        {
    headers: {
      Authorization: `Bearer ${token}`
    }
}
    );
  },

   updateProfile: async (userData)=>{
     const token = localStorage.getItem('token');
  return await instance.put(`/api/users/profile`,userData ,
      {
    headers: {
      Authorization: `Bearer ${token}`
    }
}


  );

   }
    
   
}

export default authServices;