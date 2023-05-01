const data = [0.1, 0.11, 0.12, 0.13, 0.15, 0.16, 0.18, 0.2, 0.22, 0.24, 0.27, 0.3, 0.33, 0.36, 0.39, 0.43, 0.47, 0.51, 0.56, 0.62, 0.68, 0.75, 0.82, 0.91]

let w,check=0;

function loadData() {
    const selectBlock = document.querySelector('select');

    for (let i = 0; i < data.length; i++) {

        for (let j = 0; j < 5; j++) {
            const option = document.createElement('option');
            option.innerHTML = data[i];
            selectBlock.appendChild(option);
            data[i] = data[i] * 10;
        }
    }
    console.log(selectBlock.value);
}

function add(x,y)
{
    let z=[];
    z[0]=x[0] + y[0];
    z[1]=x[1] + y[1];
    return z;
}
function mult(x,y)
{
    let z=[];
    z[0]=(x[0] * y[0]) - (x[1] * y[1]);
    z[1]=(x[0] * y[1]) + (x[1] * y[0]);
    return z;
}
function div(x,y)
{
    let z=[]; let t=[];
    t[0]=(y[0]) / ((y[0] * y[0]) + (y[1] * y[1]));
    t[1]=(-1 * y[1]) / ((y[0] * y[0]) + (y[1] * y[1]));
    z=mult(x,t);
    return z;
}

function Set_param()
{
    let image = document.getElementById('myImage');
    if (image.src.match("s2"))
    {
        alert('Switch off the circuit first.');
    }
    else
    {
        document.getElementById('r3').value = 5;
        document.getElementById('c3').value= parseFloat(document.getElementById('select').value);
    }
}
function simulate_rc()
{
    if(check === 1)
    {
        let m1=parseFloat(document.getElementById('m1').value) * 0.000001;
        let r1=parseFloat(document.getElementById('r1').value);
        let r4=parseFloat(document.getElementById('r4').value);
        document.f1.c333.value = (m1/(r1*r4)) * 1000000;
        let l1=parseFloat(document.getElementById('l1').value) * 0.000001;
        document.f1.r333.value = (r4*(l1-m1)/m1);
        document.f1.rd33.value = w * ((m1/(r1*r4))) * ((r4*(l1-m1)/m1));
    }
    else
    {
        alert("Please Switch on the supply to verify the milivoltmeter reading first.");
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
    let im5= document.getElementById('v1');
    let im6= document.getElementById('f1');
    if (image.src.match("s1")) {
        image.src = "./images/s2.png"; cf3=1;
        im5.setAttribute('readonly', 'readonly'); im6.setAttribute('readonly', 'readonly');
        check=1;
        execute_ckt();
    } else {
        image.src = "./images/s1.png"; cf3=0;
        im5.removeAttribute('readonly'); im6.removeAttribute('readonly');
        document.f1.A1.value = 0; check=0;
        perform_meter();
        document.f1.A2.value='';
        document.f1.c333.value='';
        document.f1.r333.value='';
        document.f1.rd33.value='';

    }
}
function execute_ckt()
{
    if(check === 1)
    {
        document.getElementById("A1").value=0;
        let r1=[], r3=[], r4=[], v1=[], l1=[], c3=[], f1,m1=[];
        let  z=[], z2=[], z1=[], i=[], i2=[], i1=[], dv=[], dvv;
        f1 = parseFloat(document.getElementById('f1').value);
        w = 2*3.141*f1;
        r1[0]=parseFloat(document.getElementById('r1').value); r1[1]=0;
        r3 = [5,0];
        r4[0] = parseFloat(document.getElementById('r4').value); r4[1]=0;
        l1[1] = ((w * parseFloat(document.getElementById('l1').value)) * 0.000001); l1[0]=0;
        m1[1] = ((w * parseFloat(document.getElementById('m1').value)) * 0.000001); m1[0]=0;
        c3[1] = (-1 / ((w * parseFloat(document.getElementById('c3').value)) * 0.000001)); c3[0]=0;
        v1[0] = parseFloat(document.getElementById('v1').value); v1[1]=0;

        z1 = add(add(l1,r1),add(r3,c3));
        z2 = r4;
        z = add(m1,div(mult(z1,z2),add(z1,z2)));
        i1 = div(mult(div(v1,z),z2), add(z1,z2));
        i2 = div(mult(div(v1,z),z1), add(z1,z2));
        dv = add(mult(i1,add(r3,c3)),(mult([-1,0], mult(i2,r4))));
        dvv = (Math.sqrt((dv[0] * dv[0]) + (dv[1] * dv[1])))*1000 ;
        document.getElementById("A1").value= dvv;
        document.getElementById("A2").value= dvv;
        perform_meter();
    }

}





