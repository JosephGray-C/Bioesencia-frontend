export const getUsers = async () => {
  try {
    const response = await fetch('https://randomuser.me/api/?results=10');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Service error:', error);
    throw error;
  }
};

