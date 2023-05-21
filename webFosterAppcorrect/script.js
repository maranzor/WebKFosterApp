//const data2 = [0.1, 0.11, 0.12, 0.13, 0.15, 0.16, 0.18, 0.2, 0.22, 0.24, 0.27, 0.3, 0.33, 0.36, 0.39, 0.43, 0.47, 0.51, 0.56, 0.62, 0.68, 0.75, 0.82, 0.91]

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

function add(x, y) {
	let z = [];
	z[0] = x[0] + y[0];
	z[1] = x[1] + y[1];
	return z;
}

function mult(x, y) {
	let z = [];
	z[0] = (x[0] * y[0]) - (x[1] * y[1]);
	z[1] = (x[0] * y[1]) + (x[1] * y[0]);
	return z;
}

function div(x, y) {
	let z = [];
	let t = [];
	t[0] = (y[0]) / ((y[0] * y[0]) + (y[1] * y[1]));
	t[1] = (-1 * y[1]) / ((y[0] * y[0]) + (y[1] * y[1]));
	z = mult(x, t);
	return z;
}

function Set_param() {
	let image = document.getElementById('myImage');
    
	if(image.src.match("s2")) {
		alert('Switch off the circuit first.');
	} else {
		document.getElementById('r3').value = 5;
        for(let i = 0; i < data.length; i++) {
            if (document.getElementById('select').value === data[i].C3.toString()) {

                //document.getElementById('r1_input').value = data[i].R1;
                //document.getElementById('r4_input').value = data[i].R4;
                //document.getElementById('l1_input').value = data[i].L1;
                //document.getElementById('l2_input').value = data[i].L2;
                break;
            }
 
        }
		document.getElementById('c3').value = parseFloat(document.getElementById('select').value);
	}
}

function simulate_rc() {
	if(check === 1) {
        if (document.getElementById('volt').value <= 0.05) {
        let r1_input = parseFloat(document.getElementById('r1_input').value);
		let r4_input = parseFloat(document.getElementById('r4_input').value);
        let l1_input = parseFloat(document.getElementById('l1_input').value) * 0.000001;
        let l2_input = parseFloat(document.getElementById('l2_input').value) * 0.000001;

		document.getElementById('r1_scheme').value = r1_input;
		document.getElementById('r4_scheme').value = r4_input;
        document.getElementById('l1_scheme').value = l1_input/0.000001;
        document.getElementById('l2_scheme').value = l2_input/0.000001;

		document.getElementById('capacity_result').value = (l2_input / (r1_input * r4_input)) * 1000000;
		document.getElementById('resist_result').value = (r4_input * (l1_input - l2_input) / l2_input);
		document.getElementById('factor_result').value = w * ((l2_input / (r1_input * r4_input))) * ((r4_input * (l1_input - l2_input) / l2_input));
        execute_ckt();
        } else {
            alert("Некорректное значение мультивольтметра. Оно должно быть меньше 0,05");
        }
		
	} else {
		alert("Включите пожалуйста питание");
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
	if(image.src.match("s1")) {
		image.src = "./images/s2.png";
		cf3 = 1;
		im5.setAttribute('readonly', 'readonly');
		im6.setAttribute('readonly', 'readonly');
		check = 1;
		execute_ckt();
	} else {
		image.src = "./images/s1.png";
		cf3 = 0;
		im5.removeAttribute('readonly');
		im6.removeAttribute('readonly');
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
    execute_ckt();
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
    execute_ckt();
}

function execute_ckt() {
	if(check === 1) {
		document.getElementById("volt").value = 0;
		let r1 = [],
			r3 = [],
			r4 = [],
			v1 = [],
			l1 = [],
			c3 = [],
			f1, l2 = [];
		let z = [],
			z2 = [],
			z1 = [],
			i = [],
			i2 = [],
			i1 = [],
			dv = [],
			dvv;
		f1 = parseFloat(document.getElementById('f1').value);
		w = 2 * 3.141 * f1;
		r1[0] = parseFloat(document.getElementById('r1_scheme').value);
		r1[1] = 0;
		r3 = [5, 0];
		r4[0] = parseFloat(document.getElementById('r4_scheme').value);
		r4[1] = 0;
		l1[1] = ((w * parseFloat(document.getElementById('l1_scheme').value)) * 0.000001);
		l1[0] = 0;
		l2[1] = ((w * parseFloat(document.getElementById('l2_scheme').value)) * 0.000001);
		l2[0] = 0;
		c3[1] = (-1 / ((w * parseFloat(document.getElementById('c3').value)) * 0.000001));
		c3[0] = 0;
		v1[0] = parseFloat(document.getElementById('v1').value);
		v1[1] = 0;
		z1 = add(add(l1, r1), add(r3, c3));
		z2 = r4;
		z = add(l2, div(mult(z1, z2), add(z1, z2)));
		i1 = div(mult(div(v1, z), z2), add(z1, z2));
		i2 = div(mult(div(v1, z), z1), add(z1, z2));
		dv = add(mult(i1, add(r3, c3)), (mult([-1, 0], mult(i2, r4))));
		dvv = (Math.sqrt((dv[0] * dv[0]) + (dv[1] * dv[1]))) * 1000;
		document.getElementById("volt").value = dvv;
	}
}