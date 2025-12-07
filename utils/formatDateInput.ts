export const formatDateInput = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 8);
  
    if (digitsOnly.length <= 2) {
      return digitsOnly;
    }
  
    if (digitsOnly.length <= 4) {
      return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
    }
  
    return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4)}`;
  };
