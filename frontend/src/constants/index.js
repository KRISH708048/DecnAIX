import Service4 from '../assets/svg/service4.png'
import Icon1 from '../assets/svg/icon1.svg'
// import Icon2 from '../assets/svg/icon2.svg'
import Icon3 from '../assets/svg/icon3.svg'
import Icon2 from '../assets/svg/icon4.svg'
import Service3 from '../assets/svg/service3.png'
import Service5 from '../assets/svg/service5.png'



export const benefits = [
    
    {
      id: "0",
      title: "Rental",
      text: "Want to render something? or compile ? you don&apos;t have enough compute? You are at the correct place, get your resources here from our providers",
      backgroundUrl: "./src/assets/benefits/card-2.svg",
      iconUrl: Icon2,
      imageUrl: Service4,
      light: true,
      link: "/Rent",
    },
    {
      id: "1",
      title: "Provider",
      text: "Having some resources? some idle computers, some RAM, some GPU? then join our network and start earning by renting out your resources",
      backgroundUrl: "./src/assets/benefits/card-3.svg",
      iconUrl: Icon3,
      imageUrl: Service5,
      link: "/Provider"
    },
    {
      id: "2",
      title: "Ask anything",
      text: "Contact our experts, and know your requirements. We are always happy to help and ur customers on their needs. Feel free to hop in! Our team will guide you in every step.",
      backgroundUrl: "./src/assets/benefits/card-1.svg",
      iconUrl: Icon1,
      imageUrl: Service5,
    },
    
  ];