console.log('here');

const html = `
    <div class="link-container">
        <a class="nav-link" href="/"><span class="link-text">Home</span></a>
        <a class="nav-link" href="mailto:help@allowselect.com"><span class="link-text">Contact Us</span></a>
        <a class="nav-link" href="/privacy-policy"><span class="link-text">Privacy Policy</span></a>
        <a class="nav-link" href="https://github.com/shoredevin/allowSelectApp"><span class="link-text">GitHub</span></a>
    </div>
`;

const contentContainer = document.getElementById('content-container');

contentContainer.innerHTML += html;