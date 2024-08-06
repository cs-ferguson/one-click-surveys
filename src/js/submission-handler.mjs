import { DotLottie } from "@lottiefiles/dotlottie-web"

const segments = {
    spin: [1,240],
    success: [241,399],
    fail: [539, 825]
}

const dotLottie = new DotLottie({
    canvas: document.querySelector("#lottie-player"),
    loop: true,
    autoplay: true,
    src: "https://lottie.host/5df0a64e-a883-45ec-a9b4-c09886a98295/H4elnU5DE2.lottie",
    segment: segments.spin
});

function showError ({infoText, subTitle}) {
     //transition segment when end of loop reached
     dotLottie.addEventListener("frame", (currentFrame) => {
        if(currentFrame = 240){
            dotLottie.setSegment(segments.fail[0],segments.fail[1]);
            dotLottie.setSpeed(2);
            dotLottie.setLoop(false);
        }
    })

    infoText.innerText = 'Sorry! There was a problem submitting your response';
    subTitle.innerText = 'Please try again later'
}


function showSuccess ({infoText, subTitle}) {
    //transition segment when end of loop reached
    dotLottie.addEventListener("frame", (currentFrame) => {
        if(currentFrame = 240){
            dotLottie.setSegment(segments.success[0],segments.success[1]);
            dotLottie.setSpeed(2);
            dotLottie.setLoop(false);
        }
    })
    
    infoText.innerText = 'Thank you! Your response has been submitted';
    subTitle.innerText = '(You can close this window now)'
}

export default async function submitMyForm() {

    console.log('Form submitting');

    const displayElements = {};
    displayElements.infoText = document.querySelector('.infotext');
    displayElements.subTitle = document.querySelector('.subtitle');

    displayElements.infoText.innerText = 'Submitting your response';
    displayElements.subTitle.innerText = 'please wait...'

    //get and set params
    // const splitUrlArr = window.location.href.split('?')
    // const domain = splitUrlArr[0];
    // const params = splitUrlArr.length > 1 ? splitUrlArr[1] : '';
    let params = new URLSearchParams(document.location.search);
    const score = params.get('score') || null
    const campaign = params.get('campaign') || null

    //if no score exit out
    if (!score) {
        showError(displayElements);
        let scoreError = new Error ("Score is not set", {cause: "Score not set"}); 
        console.error(scoreError);
        return scoreError; 
    }

    //if no campaign, check exists, else exit out
    if (!campaign) {
        showError(displayElements);
        let scoreError = new Error ("Campaign is not set", {cause: "Campaign not set"}); 
        console.error(scoreError);
        return scoreError; 
    }

    window.history.replaceState({}, document.title, "/");

    const url = `/.netlify/functions/submit?${params}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.error);
        }

        console.log(response);

        console.log('Form submitted');
        showSuccess(displayElements); 

        const json = await response.json();
        return json;

    } catch (error) {
        console.log('Form error');
        showError(displayElements);  
        console.error(error);
        return error;
    }
}
