import instance from "./instance";

const authServices = {
    register: async (userData) => {
        return await instance.post('/api/users/register', userData);
    },
    login: async (userData) => {
       
        return await instance.post('/api/users/login', userData);
    },
    
    getProfile: async () => {
    return await instance.get(`/api/users/profile`);
  },

   updateProfile: async (userData)=>{
   
  return await instance.put(`/api/users/profile`,userData );

   }
    
   
}

export default authServices;