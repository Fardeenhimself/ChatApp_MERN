const validateRequiredFields = (fields, reqBody) => {
    fields.forEach(field => {
      if (!reqBody[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    });
  };


  module.exports=validateRequiredFields;