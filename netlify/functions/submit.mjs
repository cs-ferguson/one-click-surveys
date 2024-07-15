export default async (req, context) => {
    const { country } = context.params;
    
  
    return new Response(`You're visiting City in ${country}!`);
  };