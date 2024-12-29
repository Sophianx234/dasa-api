export const filteredObj = function (
    obj: Record<string, any>,
    ...allowedFields: string[]
  ) {
    const newObj: Record<string, any> = {};
    Object.keys(obj).forEach((el: any) => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
  
    return newObj;
  };