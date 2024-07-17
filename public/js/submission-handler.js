async function submitMyForm() {

    console.log('Form submitting');

    const splitUrlArr = window.location.href.split('?')
    const domain = splitUrlArr[0];
    const params = splitUrlArr.length > 1 ? splitUrlArr[1] : '';

    window.history.replaceState({}, document.title, "/");

    const url = `/.netlify/functions/submit?${params}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        return json;
    } catch (error) {
        return error.message;
    }
}


async function onPageLoad () {

    const infoText = document.querySelector('.infotext');
    const subTitle = document.querySelector('.subtitle');
    infoText.innerText = 'Submitting your response';
    subTitle.innerText = 'please wait...'
    const submissionResponse = await submitMyForm();
    if (submissionResponse.error) {
        console.log(submissionResponse);
        console.log('Form error');
        infoText.innerText = 'Sorry! There was a problem submitting your response';
        subTitle.innerText = 'Please try again later'

        
    } else {
        console.log(submissionResponse);
        console.log('Form submitted');
        infoText.innerText = 'Thank you! Your response has been submitted';
        subTitle.innerText = '(You can close this window now)'
    }
}

onPageLoad();