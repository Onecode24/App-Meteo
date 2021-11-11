const Apikey='4141a3f0e41146872a214cc00746be3f'
let resultAPI;
let temps=document.querySelector('.container-infos .temps');
let temperature=document.querySelector('.container-infos .temperature');
let lieux=document.querySelector('.container-infos .lieux');
let heure=document.querySelectorAll('.bloc-heure .heure')
let temperatureH=document.querySelectorAll('.bloc-heure .temperature')
let jours=document.querySelectorAll('.bloc-jour .jour')
let temperatureJ=document.querySelectorAll('.bloc-jour .temperature')
let icone=document.querySelector('.logo')
let chargementContainer = document.querySelector('.overlay-icone-chargement');

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position=>{
      //  console.log(position);   
      let long=position.coords.longitude;
      let lat=position.coords.latitude;
      //let long=2.3389589; de cotonou
      // let lat=6.4156009; de cotonou
      AppelAPI(long,lat);
    },()=>{
        alert("Vous avez refuser la géolocalisation \n l'application ne peut fonctionner. \n veillze l'activer")
    })
}
function AppelAPI(lon,lat){
    //console.log(lon,lat);
fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=munitly&lang=fr&appid=${Apikey}`)
    .then((reponse)=>{
     return reponse.json()
    })
    .then((data)=>{
        console.log(data);
        resultAPI=data;
        temps.innerHTML=resultAPI.current.weather[0].description;
        temperature.innerHTML=`${Math.trunc(resultAPI.current.temp)-273}°`;
        lieux.innerHTML=resultAPI.timezone;

        let jour=new Date();
        let heureActuele=jour.getHours();
        //affichage des heurs par tranche de 3
        for(var i=0; i<heure.length; i++){
            let nextHour=(heureActuele+i*3)%24;
            heure[i].innerHTML=`${nextHour}h `;
        }
        //affichage de la temperature correspondant à chaque heure
        for (let index = 0; index < temperatureH.length; index++) {
            temperatureH[index].innerHTML=`${Math.trunc(resultAPI.hourly[index*3].temp)-273}°`
        }

        let tabJours=['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
        for (let index = 0; index < jours.length; index++) {
            let i=(jour.getDay()+index)%jours.length;
            jours[index].innerHTML=tabJours[i];
        }

        for (let index = 0; index < temperatureJ.length; index++) {
            temperatureJ[index].innerHTML=`${Math.trunc((resultAPI.daily[(jour.getDay()+index)%jours.length].temp.day))-273}°`;         
        }
        
        //Gestion des icone animer

        if(heureActuele>=6 && heureActuele<21){
            icone.src=`ressources/jour/${resultAPI.current.weather[0].icon}.svg`
        }else{
            icone.src=`ressources/nuit/${resultAPI.current.weather[0].icon}.svg`
        }

        chargementContainer.classList.add('disparition');
    })
}

