// Запрос данных
let request = httpGet('https://64694b3a183682d6143dc38b.mockapi.io/variants');
function httpGet(theUrl)
{
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false);
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
// Здесь наши данные
let data = JSON.parse(request);

let w, check = 0;
var a = 1;

function loadData() {
	const selectBlock = document.querySelector('select');
	let value = 0;
	for(let i = 0; i < data.length; i++) {
        const option = document.createElement('option');
        option.innerHTML = data[i].name;
        option.value = data[i].C3;
        selectBlock.appendChild(option);
	}
}


function Set_param() {
	let image = document.getElementById('myImage');
    
	if(image.src.match("s2")) {
		alert('Нужно выключить питание.');
	} else {
        for(let i = 0; i < data.length; i++) {
            if (Number(data[i].C3) === parseFloat(document.getElementById('select').value)) {
                document.getElementById('r3').value = data[i].R3;
                break;
            }
        }
		document.getElementById('c3').value = parseFloat(document.getElementById('select').value);
	}
}

function printDiv(divName) {
	let printContents = document.getElementById(divName).innerHTML;
	let originalContents = document.body.innerHTML;
	document.body.innerHTML = printContents;
	window.print();
	document.body.innerHTML = originalContents;
}

function changeImage() {
	let image = document.getElementById('myImage');
	let im5 = document.getElementById('v1');
	let im6 = document.getElementById('f1');
    let r1 = document.getElementById('r1_input');
    let r4 = document.getElementById('r4_input');
    let l1 = document.getElementById('l1_input');
    let l2 = document.getElementById('l2_input');
    let r1_scheme = document.getElementById('r1_scheme');
    let r4_scheme = document.getElementById('r4_scheme');
    let l1_scheme = document.getElementById('l1_scheme');
    let l2_scheme = document.getElementById('l2_scheme');

	if(image.src.match("s1")) {
		image.src = "./images/s2.png";
		cf3 = 1;
		im5.setAttribute('readonly', 'readonly');
		im6.setAttribute('readonly', 'readonly');
        r1.removeAttribute('readonly');
		r4.removeAttribute('readonly');
        l1.removeAttribute('readonly');
		l2.removeAttribute('readonly');
        r1_scheme.removeAttribute('readonly');
		r4_scheme.removeAttribute('readonly');
        l1_scheme.removeAttribute('readonly');
		l2_scheme.removeAttribute('readonly');
		check = 1;
		calculateVolt();
	} else {
		image.src = "./images/s1.png";
		cf3 = 0;
		im5.removeAttribute('readonly');
		im6.removeAttribute('readonly');
        r1.setAttribute('readonly', 'readonly');
        r4.setAttribute('readonly', 'readonly');
        l1.setAttribute('readonly', 'readonly');
        l2.setAttribute('readonly', 'readonly');
        r1_scheme.setAttribute('readonly', 'readonly');
        r4_scheme.setAttribute('readonly', 'readonly');
        l1_scheme.setAttribute('readonly', 'readonly');
        l2_scheme.setAttribute('readonly', 'readonly');
		document.getElementById('volt').value = 0;
		check = 0;
	}
}

function changeValue_input(value, name) {

    if (document.getElementById('r1_scheme').name === name) {
        document.getElementById('r1_scheme').value = value;
    } else if(document.getElementById('r4_scheme').name === name) {
        document.getElementById('r4_scheme').value = value;
    } else if(document.getElementById('l1_scheme').name === name) {
        document.getElementById('l1_scheme').value = value;
    } else if(document.getElementById('l2_scheme').name === name) {
        document.getElementById('l2_scheme').value = value;
    } else {
        console.log("Error");
    }
    calculateVolt();
}

function changeValue_scheme(value, name) {
    
    if (document.getElementById('r1_input').name === name) {
        document.getElementById('r1_input').value = value;
    } else if(document.getElementById('r4_input').name === name) {
        document.getElementById('r4_input').value = value;
    } else if(document.getElementById('l1_input').name === name) {
        document.getElementById('l1_input').value = value;
    } else if(document.getElementById('l2_input').name === name) {
        document.getElementById('l2_input').value = value;
    } else {
        console.log("Error");
    }
    calculateVolt();
}

function calculate() {
    if(check === 1) {
        if (document.getElementById('volt').value <= 0.005 && document.getElementById('volt').value > -1.500) {
            let r1 = parseFloat(document.getElementById('r1_input').value);
            let r4 = parseFloat(document.getElementById('r4_input').value);
            let l1 = parseFloat(document.getElementById('l1_input').value);
            let l2 = parseFloat(document.getElementById('l2_input').value);
            let f = parseFloat(document.getElementById('f1').value);

            let capacity = l2 / (r1 * r4) * (1 + ((Math.random() * (1 + 1) - 1)) / 10);
            let resist  = r4 * (Math.abs(l1-l2))/ l2 * (1 + ((Math.random() * (1 + 1) - 1)) / 10);
            let factor = resist + 1 / (6.28 * f * capacity) * (1 + ((Math.random() * (1 + 1) - 1)) / 10);
            document.getElementById('capacity_result').value = capacity;
            document.getElementById('resist_result').value = resist;
            document.getElementById('factor_result').value = factor;
            calculateVolt();
        } else {
            alert("Некорректное значение мультивольтметра. Оно должно быть меньше 0,005 и больше -1");
        }   

    } else {
        alert("Включите пожалуйста питание");
    }
}

function calculateVolt() {
    if(check === 1) {
        let voltValue = document.getElementById("volt").value;
        let r1 = parseFloat(document.getElementById('r1_input').value);
        let r3 = parseFloat(document.getElementById('r3').value);
        let r4 = parseFloat(document.getElementById('r4_input').value);
        let l1 = parseFloat(document.getElementById('l1_input').value);
        let l2 = parseFloat(document.getElementById('l2_input').value);
        let c3 = parseFloat(document.getElementById('c3').value);
        let f = parseFloat(document.getElementById('f1').value);

        //сумма активного и реактивного сопротивления конденсатора
        let xC3 = r3 + 1 / (6.28 * f * c3);
        //Добротность конденсатора
        let qi = (1 / (6.28 * f * c3)) / r3
        //Задаем  систематическу погрешность определения активного сопротивления
        let pR3 = r3 / 15;
        //Задаем  систематическу погрешность определения конденсатора
        let pC3 = c3 / 15;
        // Задаем  систематическу погрешность определения общего сопротивления
        let pXC3 = xC3 / 15;
        
        let c03 = l2 / (r1 * r4) * (1 + ((Math.random() * (1 + 1) - 1)) / 10);
        let r03  = r4 * (Math.abs(l1-l2))/ l2 * (1 + ((Math.random() * (1 + 1) - 1)) / 10);
        let xC03 = r03 + 1 / (6.28 * f * c03) * (1 + ((Math.random() * (1 + 1) - 1)) / 10);

        // Рассчитвыем абсолютную погрешнность
        let deltaC = Math.abs(c03 - c3 + pC3);
        let deltaR = Math.abs(r03 - r3 + pR3);
        let deltaXC = Math.abs(xC3 - xC03 + pXC3);

        // рассчитываем относительную погрешность, емкости, активного сопротивления и полного сопротивления конденсатора, %
        let dotnC = Math.abs(c03 - c3) / c3 * 100;
        let dotnR = Math.abs(r03 - r3) / r3 * 100;
        let dotnXC = Math.abs(xC3 - xC03) / xC3 *100;
    
        //ОПРЕДЕЛЯЕМ ПОКАЗАНИЯ МИЛИВОЛЬТМЕТРА
        voltValue = (xC3 - xC03) * 0.1;
        document.getElementById("volt").value = voltValue;
        console.clear();
        infoLog(xC3, qi, r3, c03, r03, xC03, deltaC, deltaR, deltaXC, dotnC, dotnR, dotnXC);
    }
}

function infoLog(xC3, qi, r3, c03, r03, xC03, deltaC, deltaR, deltaXC, dotnC, dotnR, dotnXC) {
    console.log("сумма активного и реактивного сопротивления конденсатора: " + xC3);
    console.log("Добротность конденсатора: " + qi);
    console.log("Полное сопротивление емкости: " +r3);
    console.log("Емкость Ф: " + c03);
    console.log("Активное сопротивление емкости Ом: " +r03);
    console.log("Полное сопротивление емкости, Ом: " +xC03);
    console.log("deltaC абсолютную погрешнность: " + deltaC);
    console.log("deltaR абсолютную погрешнность: " +deltaR);
    console.log("deltaXC абсолютную погрешнность: " +deltaXC);
    console.log("относительная погрешность емклости %", dotnC)
    console.log("относительная погрешность активного сопротивления %", dotnR)
    console.log("относительная погрешность полного сопротивления емкости %", dotnXC)
}