export const getUsers = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/usuarios');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Service error:', error);
    throw error;
  }
};

