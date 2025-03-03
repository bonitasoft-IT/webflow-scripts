var userbegingenerateboolean = false;
var userbegintimetogenerate = 0;
var userbegintimetogeneratef = 0;
var usertimetocompleteformafterclicgenerate = 0;
var usertimetocompleteformafterclicgeneratef = 0;
var userclickedtoboolean = false;
var usertapforbidenword = false;
var userraisedlimittextarea = false;
var userraisedbpmnlimit = false;
var usertexttobpmnprompt = '';
var userleavepage = false;
var userBrowserFingerprintresult;
var debugdelaybegin = 0;
var debugdelay = 0;
const userBrowserFingerprint = getHashedBrowserFingerprint();  
const userformdemofilled = false;
// Attendre que la promesse soit résolue et stocker le résultat dans une variable 
var tempsEcoule = 0;
const maxPromptSize = 500;
const delayInMilliseconds = 500;
const motsInterdits = ["http://","https://","www","ftp://","mailto:","smb://","afp://","file://","gopher://","news://","ssl://","sslv2://","sslv3://","tls://","tcp://","udp://","url=","href=dating","sex","porn","fuck","free","captcha","spam","hello. and bye.","mail.ru","reading this message","reading my message","reading through my message","are whitelisted","great website","late client","ciao a tutti","viagra","cheap","casino","advertising","keyword","promotion","porntubered","    :","   :","ps: how are you?","beautiful models","privet","beautiful girls","best girls","dosug","trustable","look at the","v7bomdefex","what is it -","email marketing","read your site","SEO","seo","mot1", "mot2", "mot3"]; // Liste des mots à exclure
const messageErreur = document.getElementById("messageErreur");
const textMessageTitleError1 = 'Please enter a prompt before generating the BPMN model.';
const textMessageTitleError2 = 'Oops! It looks like your post contains spam content. If you believe otherwise, please contact us. We apologize for the inconvenience.';
const textMessageTitleError3 = '😅 Something went wrong!<span class="Mascotte-Bonita"></span>';
const textMessageDescriptionError1 = "Your request can't be made into a process model as it is written.<br /> Try describing your process again - use simple terms, and be as clear as possible about who does what and in what order. <br /><div class='text-rich-text w-richtext'><h2 class='Bloc-dynamic-TitleText-TitleTextList-element-title'>You can try again!</h2></div>";
const textMessageTitleProgress1 = 'Hang tight! Your BPMN model is being generated';
const textMessageTitleSuccess1 = 'We have generated your BPMN model!';

// Get the current date
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const day = String(currentDate.getDate()).padStart(2, '0');

// Set the expiration date to the end of the current day
const expirationDate = new Date(year, currentDate.getMonth(), day, 23, 59, 59).toUTCString();
const cookieName = `session_user_reachedlimit_${year}-${month}-${day}`;

function updateCharCount() {
    const description = document.getElementById('user_prompt_bpmn');
    const charCount = document.getElementById('charCount');
    const remaining = maxPromptSize - description.value.length;
    charCount.textContent = description.value.length + '/500 characters';
    //document.getElementById("user-empreintenavigateur").innerHTML = userBrowserFingerprintresult;
    //console.log('userBrowserFingerprintresult : '+userBrowserFingerprintresult);
    if(description.value.length == maxPromptSize || description.value.length > maxPromptSize) {  
        //document.getElementById("Containeruser-errormessage").innerHTML= 'You reached the maximum prompt size';      
        setTimeout(function() {
            //your code to be executed after 1 second
            //console.log('Your reached the maximum prompt size');
            //document.getElementById("user-raisedlimittextarea").innerHTML = 'true';
            userraisedlimittextarea = true;
        }, delayInMilliseconds);
    }else {
        if(userraisedlimittextarea == true) {
            userraisedlimittextarea = false;
            //document.getElementById("user-raisedlimittextarea").innerHTML = 'false';
        }
    }
    if(userbegingenerateboolean == false) {
        userbegintimetogenerate = new Date();
        userbegingenerateboolean = true;
    }else {
        if(userclickedtoboolean == false) {
            tempsEcoule = getTempsecoule(userbegintimetogenerate);
            console.log("Temps écoulé : " + tempsEcoule + " secondes");
            document.getElementById("user-timetoclickgenerate").innerHTML= tempsEcoule+'s';
            userbegintimetogeneratef = tempsEcoule;
        }
    }
}

$("#user_prompt_bpmn").on("input", function() { 
	updateCharCount();
});

document.getElementById('user_promp_bpmn_form').addEventListener('submit', async function(e) {
	e.preventDefault(); // Empêche le rechargement de la page lors de la soumission
  console.log('Clic to generate button ok');
  userBrowserFingerprintresult = await userBrowserFingerprint; 
  document.getElementById("user-empreintenavigateur").innerHTML = userBrowserFingerprintresult;
    document.getElementById("user-clickgenerate").innerHTML= 'true';
    userclickedtoboolean = true;

    textarea = document.getElementById('user_prompt_bpmn');
    if(textarea.value.length == 0) {
        //console.log('Textarea is empty');
        messageErreur.textContent = textMessageTitleError1;
    }else {
        /*
        [^...] signifie "tout sauf".
        a-zA-Z permet d'inclure les lettres majuscules et minuscules.
        0-9 permet d'inclure les chiffres.
        \s permet d'inclure les espaces.
        , permet d'inclure les virgules
        */
        textarea.value = textarea.value.replace(/[^a-zA-Z0-9À-ÖØ-öø-ÿ,\s]/g, '');
        let texte = textarea.value;
        /* split sur virgule et espace */
        let mots = texte.split(/[,\s]+/); // Séparer le texte en mots

        let contientMotInterdit = mots.some(mot => motsInterdits.includes(mot));

        if (contientMotInterdit) {
            usertapforbidenword = true;
            document.getElementById("user-clickgeneratewithforbidenword").innerHTML = "true";
            messageErreur.textContent = textMessageTitleError2;
        } else {
            messageErreur.textContent = "";
            tempsEcoule = getTempsecoule(userbegintimetogenerate);
            document.getElementById("user-timetoclickgenerate").innerHTML= tempsEcoule+'s';
            userbegintimetogenerate = tempsEcoule;
            usertapforbidenword = false;
            usertexttobpmnprompt = textarea.value;
            //console.log('Prompt to send : '+usertexttobpmnprompt);
            
            usertimetocompleteformafterclicgenerate = new Date();
            

            // Check if the cookie exists
            let cookieValue = getCookie(cookieName);
            if(cookieValue < 3) {
                let cookieuserformdemoValue = getCookie('userformdemofilled');
                if (cookieuserformdemoValue) {
                    if(cookieuserformdemoValue == 1) {
                        tempsEcoule = getTempsecoule(usertimetocompleteformafterclicgenerate);
                        //console.log("Temps écoulé pour saisie du formulaire: " + tempsEcoule + " secondes");
                        document.getElementById("user-timetoclickgenerate").innerHTML= tempsEcoule+'s';
                        usertimetocompleteformafterclicgeneratef = tempsEcoule;
                        /*
                        sendDatas();
                        jQuery('.TexttoBPMN-error-message').html('');
                        jQuery('.TexttoBPMN-promptandForm-title').html(textMessageTitleProgress1);
                        jQuery('#block-bonitasoft2022-start-the-demo-bpmn-ai').removeClass('active');
                        jQuery('.TexttoBPMN-loaderBPMN-new').addClass('active');
                        jQuery('.TexttoBPMN-containerForm').removeClass('active');
                        */
                    }
                }else {
                    /*
                    sendDatasBeforePrompt();
                    jQuery('#block-bonitasoft2022-start-the-demo-bpmn-ai').addClass('active');
                    */
                }
            }else {
                jQuery('.TexttoBPMN-user-reached-limit').css('display','flex');
            }
        }
    }
});


function getBrowserFingerprint() {
    // Récupération des informations de base du navigateur
    const userAgent = navigator.userAgent;
    const screenResolution = `${screen.width}x${screen.height}`;
    const colorDepth = screen.colorDepth;
    const language = navigator.language || navigator.userLanguage;
    const timezoneOffset = new Date().getTimezoneOffset();
    const platform = navigator.platform;
    const plugins = navigator.plugins;

    // Combinaison des différentes informations pour créer une empreinte unique
    const fingerprint = `${userAgent} | ${screenResolution} | ${colorDepth} | ${language} | ${timezoneOffset} | ${platform} | ${plugins}`;
    console.log('fingerprint'+fingerprint);
    return fingerprint;
}

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function getHashedBrowserFingerprint() {
    const fingerprint = getBrowserFingerprint();
    const hashedFingerprint = await sha256(fingerprint);
    return hashedFingerprint;
}

function getTempsecoule(begintime) {
    let fin = new Date();
    // Calculer le temps écoulé en millisecondes
    var result = fin - begintime;
    result /= 1000;
    return result;
}

// Function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
  
// Function to get a cookie value
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Function to display error to user
function displayErrortoUser() {
    jQuery('.TexttoBPMN-promptandForm-title').html(textMessageTitleError3);
    jQuery('.TexttoBPMN-error-message').html(textMessageDescriptionError1);
    /*jQuery('.TexttoBPMN-containerForm').addClass('active');*/
    scrollToBPMNBloc();
}

function scrollToBPMNBloc() {
    if (jQuery('main.navbar').length) {
        jQuery('html, body').animate({
            scrollTop: jQuery('.TexttoBPMN-promptandForm-title').offset().top - jQuery('main.navbar').height()
        }, 1000); // 1000 ms = 1 second
    }
  }
