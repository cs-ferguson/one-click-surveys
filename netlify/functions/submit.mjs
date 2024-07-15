export default async (req, context) => {
    const { city, country } = context.params;
  
    return new Response(`You're visiting ${city} in ${country}!`);
  };