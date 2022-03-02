// Pre-define constant
const dataUrl = "https://raw.githubusercontent.com/help-14/mechanical-keyboard/master/README.md";

// Navigating between tab, change the active link in navigation bar
function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;
    window.location.hash = tabName;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.querySelectorAll(".main.tabcontent)");
    tabcontent.forEach(tab => tab.style.display = "none");

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.querySelectorAll(".tablink");
    navLinks.forEach(link => link.className = link.className.replace(" active", ""));

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    if (evt) {
        evt.currentTarget.className += " active";
        document.getElementById('nav').style.display = "";
    }
    else document.getElementById('nav').style.display = "none";
}

function showAllTab() {
    tabcontent = document.querySelectorAll(".tabcontent");
    tabcontent.forEach(tab => tab.style.display = "block");
}

// Show error tab and hide navigation bar
function showError() { openTab(null, 'error'); }

function parseGitHubData(data) {
    // split text to line array
    let lineArr = data.trim().split('\n');

    // Data index as in Readme.md file
    const blockIndex = {
        NormalLayout: 0,
        ErgonomicsLayout: 1,
        OrtholinearLayout: 2,
        Macropad: 3,
        OthersLayout: 4,
        Controller: 5,
        Case: 6,
        Plate: 7,
        Keycap: 8,
        Firmware: 9,
        Tools: 10,
        Tutorials: 11
    };

    // new 2d array with line start, line end index for data blocks
    let blocks = Array.from(new Array(Object.keys(blockIndex).length), () => [null, null]);

    // moving each line and check if it is start or end line of a block
    let currentBlock = -1;
    for (let lineIndex = 0; lineIndex < lineArr.length; lineIndex++) {
        let lineText = lineArr[lineIndex];
        if (lineText.includes('## ')) {
            if (currentBlock < 0) {
                if (lineText.includes('Normal Keyboards'))
                    currentBlock = 0;
                else
                    continue;
            }
            if (currentBlock < blocks.length - 1) {
                if (blocks[currentBlock][0]) {
                    blocks[currentBlock][1] = lineIndex;
                    currentBlock++;
                    blocks[currentBlock][0] = lineIndex + 1;
                } else {
                    blocks[currentBlock][0] = lineIndex + 1;
                }
            }
        }
        else if (lineText.trim() == '---' && currentBlock === blocks.length - 1) {
            blocks[blocks.length - 1][1] = lineIndex - 1;
        }
    }

    function splitArray(blockInfo) {
        var newArr = lineArr.slice(blockInfo[0], blockInfo[1]);
        for (let i = 0; i < newArr.length; i++) {
            let lineText = newArr[i].trim();
            if (lineText.length === 0 || lineText.includes('Description') || lineText.includes('---'))
                newArr[i] = null;
        }
        return newArr.filter(line => line !== null);
    }

    function formatMarkdown(markdown) {
        if (markdown.includes('<br />'))
            return mmd(markdown.replace(/<br \/>/g, '\\').replace(/<br>/g, '\\')).replace(/\\/g, '<br />');
        else
            return mmd(markdown);
    }

    function formatTable(tableArr) {
        for (let i = 0; i < tableArr.length; i++) {
            let cells = tableArr[i].split('|');

            let name = cells[2].substr(cells[2].indexOf('[') + 1);
            name = name.substr(0, name.indexOf(']')).trim();

            tableArr[i] =
                `<li class='badge'>
                    <span class="solid major style1"></span>
                    ${cells[1].replace('minwidth="500"', 'width="90%"')}
                    <h3>${mmd(cells[2])}</h3>
                    <p>${formatMarkdown(cells[3])}</p>
                </li>`;
        }
        return tableArr.join('\n');
    }

    function formatList(tableArr) {
        for (let i = 0; i < tableArr.length; i++) {
            let content = tableArr[i].replace('- ', '').trim();
            content = formatMarkdown(content).replace('<p>', '<li>').replace('</p>', '</li>');
            tableArr[i] = content
        }
        return tableArr.join('\n');
    }

    function splitAndFormatTable(blockInfo) {
        return formatTable(splitArray(blockInfo));
    }

    function draw(elementId, html) {
        document.querySelector(elementId).innerHTML = html;
    }

    function drawTable(elementId, index) {
        draw(`#${elementId} > ul`, splitAndFormatTable(blocks[index]));
    }

    function drawList(elementId, index) {
        draw(elementId, formatList(splitArray(blocks[index])));
    }

    // draw data to tab
    drawTable('normalLayout', blockIndex.NormalLayout);
    drawTable('ergonomicLayout', blockIndex.ErgonomicsLayout);
    drawTable('ortholinearLayout', blockIndex.OrtholinearLayout);
    drawTable('macropad', blockIndex.Macropad);
    drawTable('otherLayout', blockIndex.OthersLayout);
    drawTable('controller', blockIndex.Controller);
    drawTable('case', blockIndex.Case);
    drawTable('plate', blockIndex.Plate);
    drawTable('keycap', blockIndex.Keycap);

    drawList('#firmware-panel', blockIndex.Firmware);
    drawList('#tools-panel', blockIndex.Tools);
    drawList('#tutorial-panel', blockIndex.Tutorials);

    return true;
}

// Get Readme.md from github and fill data to each tab
async function fetchGithubData() {
    var response = await fetch(dataUrl);
    if (!response.ok) {
        showError();
        return;
    }
    var data = await response.text();
    if (parseGitHubData(data)) {
        if (window.location.hash.length > 0) {
            var currentPage = window.location.hash.replace('#', ''); //currentUrl.searchParams.get("page");
            var button = document.querySelector(currentPage ? `#nav a[tab="${currentPage}"]` : "#navHome");
            if (button) button.click();
        }

        if (window.screen.width <= 736) {
            console.log('width: ' + window.screen.width)
            showAllTab();
        }
    }
    else
        showError();
}

// Add event onclick to dropdown
var navLinks = document.querySelectorAll(".dropdown");
navLinks.forEach(link => {
    link.addEventListener("click", e => e.currentTarget.className += " active");
});

// Add event onclick to each navigation link
var navLinks = document.querySelectorAll(".tablink");
navLinks.forEach(link => {
    link.addEventListener("click", e => openTab(e, link.getAttribute('tab')));
});

// Add event for show all tab button
btnShowAllTab.addEventListener("click", e => showAllTab());

// Load github data on load
fetchGithubData();
