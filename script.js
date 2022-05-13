const buttons = document.querySelectorAll("button");
const mainText = document.getElementById("text");

class State{
    constructor(){
        this._strategy = null;
        this._name = null;
    }

    set currentState(state){
        this._strategy = state;
        this._name = state._name;
    }

    loadState(){
        this._strategy.loadState();
    }

    inputState(){
        this._strategy.inputState();
    }

    updateList(){
        this._strategy.updateList();
    }

    addElem(text){
        this._strategy.addElem(text);
    }

    get currentState(){
        return this._name;
    }
    
}

class Completed{
    constructor(name){
        this._name = name;
    }

    loadState(){
        sessionStorage.setItem("state", JSON.stringify(this._name));
        buttons[0].disabled = true;
        buttons[1].disabled = false;
        buttons[2].disabled = false;
    }

    updateList(option){
        if(option == undefined){
            option = 0;
        }
        const oldUl = document.querySelectorAll("form");
        oldUl.forEach(elemUl =>{
            elemUl.remove();
        });
        const form = document.createElement("form");
        const mainText = document.createElement("p");
        mainText.innerHTML = "Completed";
        mainText.classList.add("completed-topPanel");
        form.appendChild(mainText);
        const arr = JSON.parse(localStorage.getItem(state._name)) || [];

        if(arr.length){
            const elementDIV = document.createElement("div");
            elementDIV.classList.add("completed-body");
            const elementSpan = document.createElement("span");
            elementSpan.innerHTML = arr[option].date +":";
            elementDIV.appendChild(elementSpan);
            const elementUL = document.createElement("ul");
            arr[option].obj.forEach(el =>{
                const textLi = document.createElement("li");
                textLi.innerHTML = el.text;
                if(el.comp == true){
                    textLi.classList.add("change");
                }
                elementUL.appendChild(textLi);
            });
            elementDIV.appendChild(elementUL);
            form.appendChild(elementDIV);
            const bottomPanel = document.createElement("div");
            bottomPanel.classList.add("completed-bottomPanel");
            const size = arr.length;
            for(let i=0; i<size; i++){
                const radio = document.createElement("input");
                radio.setAttribute("type", "radio");
                radio.setAttribute("name", "radio");
                radio.setAttribute("value", i);
                if(i==option){
                    radio.checked = true;
                }
                bottomPanel.appendChild(radio);
            }
            bottomPanel.addEventListener("change", (e)=>{
                console.log(e.target);
                let target = (e.target).value;
                this.updateList(target);
            });
            form.appendChild(bottomPanel);
        }

        document.body.appendChild(form);

    }

}

class Current{
    constructor(name){
        this._name = name;
    }

    loadState(){
        sessionStorage.setItem("state", JSON.stringify(this._name));
        buttons[0].disabled = false;
        buttons[1].disabled = true;
        buttons[2].disabled = false;
    }

    updateList(){

        const oldUl = document.querySelectorAll("form");
        oldUl.forEach(elemUl =>{
            elemUl.remove();
        });
        const form = document.createElement("form");
        form.classList.add("current-form");
        const formHeader = document.createElement("div");
        formHeader.classList.add("current-header");
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("class", "input");
        input.setAttribute("placeholder", "Enter your input...");
        input.setAttribute("autocomplete", "off");
        formHeader.appendChild(input);
        form.addEventListener("submit", (e)=>{
            this.addElem(input.value);
            input.value = "";
            this.updateList();
        });
        const saveButton = document.createElement("button");
        saveButton.setAttribute("type", "button");
        const imgButton = document.createElement("i");
        saveButton.addEventListener("click", ()=>{
            const press = confirm(`Are you sure you want to move your toDos from current to completed? \nIt will be impossible to take them back from completed`);
            if (press == true){
                var today = new Date();
                var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                let arr = JSON.parse(localStorage.getItem("completed")) || [];
                let currentArray = JSON.parse(localStorage.getItem(state._name));
                if(currentArray.length){
                    if(arr.length && arr[0].date == date){
                        currentArray.forEach(elem =>{
                            arr[0].obj.push(elem);
                        });
                    }else{
                        if(arr.length>=30){
                            arr.pop();
                        }
                        arr.push({
                            obj : currentArray,
                            date : date
                        });
                    }   
                    arr.sort((a,b) =>  new Date(b.date) - new Date(a.date));
                    localStorage.setItem("completed", JSON.stringify(arr));
                    localStorage.removeItem(state._name);
                    this.updateList();
                }else{
                    alert("You did not complete anything today!")
                }
            }
        });
        imgButton.classList.add("far");
        imgButton.classList.add("fa-save");
        saveButton.appendChild(imgButton);
        formHeader.appendChild(saveButton);
        form.appendChild(formHeader);
        const formBody = document.createElement("ul");
        formBody.classList.add("current-body");
        const arr = JSON.parse(localStorage.getItem(state._name)) || [];
        arr.forEach(element=>{
            const liElem = document.createElement("li");
            liElem.innerHTML = element.text;
            if(element.comp == true){
                liElem.classList.toggle("change");
            }
            liElem.addEventListener("click", () =>{
                const press = confirm(`Do you want to delete: ${element.text}?`);
                if (press == true){
                    const arr = JSON.parse(localStorage.getItem(state._name));
                    const index = arr.map(e => e.text).indexOf(element.text);
                    arr.splice(index, 1);
                    localStorage.setItem(state._name, JSON.stringify(arr));
                    liElem.remove();
                }
            });
            liElem.addEventListener("contextmenu", (e) =>{
                e.preventDefault();
                liElem.classList.toggle("change");
                const arr = JSON.parse(localStorage.getItem(state._name));
                const index = arr.map(e => e.text).indexOf(element.text);
                console.log(index);
                if(liElem.classList.contains("change") == true){
                    arr[index].comp = true;
                }else{
                    arr[index].comp = false;
                }
                localStorage.setItem(state._name, JSON.stringify(arr));

            });
            formBody.appendChild(liElem);
        });
        form.appendChild(formBody);
        const spanA = document.createElement("span");
        spanA.innerHTML = "Left mouse click to delete<br>";
        const spanB = document.createElement("span");
        spanB.innerHTML = "Right mouse click to complete";
        form.appendChild(spanA);
        form.appendChild(spanB);
        document.body.appendChild(form);
            
    }

    addElem(text){
        const arr = JSON.parse(localStorage.getItem(state._name)) || [];
        arr.push({
            text : text,
            comp: false
        });
        localStorage.setItem(state._name, JSON.stringify(arr));

    }
}

class Future{
    constructor(name){
        this._name = name;
    }

    loadState(){
        sessionStorage.setItem("state", JSON.stringify(this._name));
        buttons[0].disabled = false;
        buttons[1].disabled = false;
        buttons[2].disabled = true;
    }

    updateList(){

        const oldUl = document.querySelectorAll("form");
        oldUl.forEach(elemUl =>{
            elemUl.remove();
        });
        const form = document.createElement("form");
        const formHeader = document.createElement("div");
        formHeader.classList.add("future-header");
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("class", "input");
        input.setAttribute("placeholder", "Enter your input...");
        input.setAttribute("autocomplete", "off");
        formHeader.appendChild(input);
        form.addEventListener("submit", (e)=>{
            e.preventDefault();
            this.addElem(input.value);
            input.value = "";
            this.updateList();
        });
        form.appendChild(formHeader);
        const formBody = document.createElement("ul");
        formBody.classList.add("future-body");
        const arr = JSON.parse(localStorage.getItem(state._name)) || [];
        arr.forEach(element=>{
            const liElem = document.createElement("li");
            liElem.innerHTML = element;
            liElem.addEventListener("click", () =>{
                const arr = JSON.parse(localStorage.getItem(state._name));
                const index = arr.indexOf(element.innerHTML);
                arr.splice(index, 1);
                localStorage.setItem(state._name, JSON.stringify(arr));
                liElem.remove();
            });
            formBody.appendChild(liElem);
        });
        form.appendChild(formBody);
        document.body.appendChild(form);

    }

    addElem(text){
        const arr = JSON.parse(localStorage.getItem(state._name)) || [];
        arr.push(text);
        localStorage.setItem(state._name, JSON.stringify(arr));
    }
}

const state = new State();
const state1 = new Completed(buttons[0].innerHTML);
const state2 = new Current(buttons[1].innerHTML);
const state3 = new Future(buttons[2].innerHTML);

const text = JSON.parse(sessionStorage.getItem("state"));
if(!text){
    select(state2);
}else{
    clickButton(text);
}

function clickButton(btnName){
    if(state1._name == btnName){
        select(state1);
    }else if(state2._name == btnName){
        select(state2);
    }else{
        select(state3);
    }
}

function select(chosed){
    state.currentState = chosed;
    state.loadState();
    state.updateList();
}