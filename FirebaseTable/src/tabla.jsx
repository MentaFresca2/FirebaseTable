import { useEffect, useState , useRef} from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, off , push, set, update, get, remove } from "firebase/database";
import './tabla.css';
import dbconfig from "./dbconfig.json"
//You need to fill the dbconfig.json with the apikey, databaseURL, etc.
//IMPORTANT: I literally forgot abount ";" so, minify at your own risk. All the data saved in the db will be in a node called "data".

function Esperar(segundos){ 
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(); 
    }, segundos * 1000);  
  });
};

async function borrarmodal(){
    
  if(document.getElementById("modalnotifi").classList){
    await Esperar(4); //The notification time is 4 secs so dont remove this

    document.getElementById("modalnotifi").classList.remove("modalnotifi")


  }




}

function Tabla() {

  const firebaseConfig = dbconfig;//Meter esto en el apartado de ajustes (Poner boton de ajustes arriba al a derecha para poner la base de datos)
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const databaseRef = ref(database, "data");

    
    function eliminar(event){
    const alref = event.currentTarget.dataset.alref //alref is alternative reference, is the reference to the objet in the firebase db
    const refe = ref(database,`data/${alref}`);
    if (confirm("Are you sure thath u want to remove this item?")) {
    remove(refe)
    }
    


    }
    function mod(event) {
      document.getElementById("modal").classList.add("modal"); document.getElementById("modal").classList.remove("modalfadeout"); 
      const alref = event.currentTarget.dataset.alref;
      const refe = ref(database,`data/${alref}`); //Reference to the specific data
      const inputs = document.getElementById("modal").querySelectorAll("input");
      const anadir = document.getElementById("anadir")
      get(refe)
        .then((snapshot) => {
            
          const data = snapshot.val();
          inputs[0].value = data.compatibilidad;
          inputs[1].value = data.marca;
          inputs[2].value = data.modelo;
          inputs[3].value = data.referencia;
          inputs[4].value = data.cantidad_garage;
          inputs[5].value = data.cantidad_furgo;
         
             
                
            
        })
        .catch((error) => {
            console.error("Error:", error);
        });
        anadir.addEventListener('click', function() {
        remove(refe)



        })
}
  




    function sumar (event){
      var donde = ""
      
      if(isNaN(parseFloat(event.currentTarget.dataset.valor))){
        valor = 0


      } else{
        var valor = parseFloat(event.currentTarget.dataset.valor)

      }
      var garOfur = event.currentTarget.dataset.garofur
      valor += 1
      
      if (garOfur == "fur"){
        donde = "cantidad_furgo"



      } else{
        donde = "cantidad_garage"


      }
      var alref = event.currentTarget.dataset.alref 
      var dbref = ref(database, `data/${alref}`);
      
      update(dbref,{
        [donde]: valor
    })





    }
    function restar (event){ 
      var donde = ""
      var valor;
      
      if(isNaN(parseFloat(event.currentTarget.dataset.valor))){
        valor = 0


      } else{
        var valor = parseFloat(event.currentTarget.dataset.valor)

      }
      
      

      var garOfur = event.currentTarget.dataset.garofur
      
      valor -= 1
      
      
      if (garOfur == "fur"){
        donde = "cantidad_furgo"



      } else{
        donde = "cantidad_garage"


      }
      var alref = event.currentTarget.dataset.alref 
      var dbref = ref(database, `data/${alref}`);
      
      update(dbref,{
        [donde]: valor
    })





    }









    const [selectedValue, setSelectedValue] = useState('referencia'); 

    const handleSelectChange = (event) => {
      setSelectedValue(event.target.value.toString());
    };


  const [InputValue, setInputValue] = useState('');//This is for the search input

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };




  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {


    
    const onDataUpdate = (snapshot) => { 

      const firebaseData = snapshot.val();
      
      if (firebaseData) {
        const dataArray = Object.entries(firebaseData);
        
        
        setData(dataArray);
        var dataArray2 = []
        for(var x in dataArray){ //This is to input the alternative reference in each data object, allowing for subsequent addition and subtraction while having the reference on the buttons making some things easier later.
          
          dataArray[x][1].alref = dataArray[x][0]
          dataArray2.push(dataArray[x][1])
          

        }

        
        
        
        
        const filteredArray = dataArray2.filter(item => item[selectedValue].toLowerCase().includes(InputValue.toLowerCase())); //toLowerCase() converts strings to lowercase so that the search doesn't differentiate between uppercase and lowercase.
        setFilteredData(filteredArray);
        
       
      }
    };

    const dataRef = onValue(databaseRef, onDataUpdate);
    return () => { 
      off(databaseRef, 'value', dataRef);
    };//cancels the suscription to the database
  }, [InputValue, selectedValue]); 
  



  const handleKeyDown = (event, nextInputRef) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      nextInputRef.current.focus();
    }
  };



  const ComVal = useRef(null); 
  const MarVal = useRef(null); 
  const ModVal = useRef(null);
  const RefVal = useRef(null);
  const GarVal = useRef(null);
  const FurVal = useRef(null);
  
  
  const AnadirCent = ()=>{
    
    const nuevaCentralitaRef = push(databaseRef);
    
    set(nuevaCentralitaRef, {compatibilidad: ComVal.current.value ,marca: MarVal.current.value ,modelo: ModVal.current.value , referencia: RefVal.current.value,cantidad_garage: GarVal.current.value,cantidad_furgo: FurVal.current.value });
    modalnotifi();
    ComVal.current.value = ""
    MarVal.current.value = ""
    ModVal.current.value = ""
    RefVal.current.value = ""
    GarVal.current.value = ""
    FurVal.current.value = "" 

  }
  

  const modalnotifi = ()=>{borrarmodal(); document.getElementById("modalnotifi").classList.add("modalnotifi")}

  






  const mostrarbotones = (event)=>{ //Arrow functions goooooooooooooooooood (I like arrow functions)
    
    const fila = event.currentTarget.dataset.alref;
    const currentbuttons = Array.from(document.getElementsByClassName("botonselect"))
    
    for (let x in currentbuttons){
  
      if(currentbuttons[x].dataset.alref == fila){

        
        currentbuttons[x].classList.add("mostrar")
        event.currentTarget.classList.add("oscuro")
        
  
      }

    }






  }

  const ocultarbotones = (event)=>{

    const fila = event.currentTarget.dataset.alref;
    const currentbuttons = Array.from(document.getElementsByClassName("botonselect"));
    
    for (let x in currentbuttons){
     
      if(currentbuttons[x].dataset.alref == fila){ //when leave the hover in a row it delete the classes "mostrar" and "oscuro"

        
        currentbuttons[x].classList.remove("mostrar")
        event.currentTarget.classList.remove("oscuro")
  
  
      }

    }





  }

  const seleccionar = (event)=>{
    const fila = event.currentTarget;
    const filas = Array.from(document.getElementsByClassName("fila")) 
    const currentbuttons = Array.from(document.getElementsByClassName("botonselect"));
   
    for(let x in currentbuttons){
      
        
        
      currentbuttons[x].classList.remove("mostrar2")
  
  
      
      if(currentbuttons[x].dataset.alref == fila.dataset.alref){
        
        
        currentbuttons[x].classList.add("mostrar2")
  
  
      }




    }

    for(let x in filas){ //remove the previous "senalado"/focused item the focus propietis removing the class with a for (You can change it to 'for on' Sometimes I forget about that)
      if(filas[x].classList.contains("senalado")){
         filas[x].classList.remove("senalado")



      }





    }
    fila.classList.add("senalado")




  }




    
















  return ( //I use so much the style={{}}, Im sorry if u want to modify this sht code.
    <div>
      
      <dialog style={{borderColor:"black", boxShadow:"black 5px 5px 5px 5px"}} id='modal'>
        
          <div style={{display:"flex", flexDirection:"row", justifyContent:"center",gap:"20px", alignItems:"flex-end"}}>
          <div style={{display:"flex", flexDirection:"column", alignContent:"center",gap:"22px",width:"50%"}}>
            <p style={{margin:"0"}}>Name:	</p>
            <p style={{margin:"0"}}>Brand:</p>
            <p style={{margin:"0"}}>Model:</p>
            <p style={{margin:"0"}}>Reference:</p>
            <p style={{margin:"0"}}>Quantity 1:</p>
            <p style={{margin:"0"}}>Quantity 2: </p>
            <button className='botonesmodal' style={{cursor:"pointer",}} onClick={async()=>{ document.getElementById("modal").classList.add("modalfadeout"); await Esperar(0.4); document.getElementById("modal").classList.remove("modal")}}>Cancel</button>
            </div>



          <div style={{display:"flex", flexDirection:"column", alignContent:"center",gap:"20px",width:"50%"}}>
            <input className='ModalInput' ref={ComVal} type='text' placeholder='Name' onKeyDown={(event) => handleKeyDown(event, MarVal)}/>
            <input className='ModalInput' ref={MarVal} type='text' placeholder='Brand'  onKeyDown={(event) => handleKeyDown(event, ModVal)}/>
            <input className='ModalInput' ref={ModVal} type='text' placeholder='Model' onKeyDown={(event) => handleKeyDown(event, RefVal)}/>
            <input className='ModalInput' ref={RefVal} type='text' placeholder='Reference' onKeyDown={(event) => handleKeyDown(event, GarVal)}/>
            <input className='ModalInput' ref={GarVal} type='text' placeholder='Quantity 1' onKeyDown={(event) => handleKeyDown(event, FurVal)}/> {/*Resulta que event es para escuchar el teclado y eso xd que curioso oye lo que aprende uno */}     
            <input className='ModalInput' ref={FurVal} type='text' placeholder='Quantity 2' onKeyDown={(event ) => {if (event.key === 'Enter') {AnadirCent(); handleKeyDown(event, ComVal)}}}/>     
            <button id='anadir' className='botonesmodal' style={{cursor:"pointer",}} onClick={AnadirCent} >Add</button>
          </div>


          </div>
          
          
        
        </dialog>
        <div style={{display:"flex",flexDirection:"row",marginBottom:"20px",alignItems:'center',gap:"20px",margin:"70px 0 20px 0"}}>
        
    <div className='Buscador' style={{display:"flex", flexDirection:"row", alignItems:"center", margin:"0"}}>
      <input className='buscar' type="text" value={InputValue} onChange={handleInputChange} placeholder="Search" style={{color:"white",background:"#1f1f1f", marginBottom: "20px", marginTop: "20px",height:"25px",borderTopLeftRadius:"10px",borderBottomLeftRadius:"10px",padding:"0 0 0 7px",margin:"0 0 0 0 ",border:"solid 2px #454545" }} /> {/*Creo que esto tendria que haberlo hecho en un css xd*/}
      <select className='select1' value={selectedValue} onChange={handleSelectChange} style={{cursor:"pointer",color:"white",background:"#1f1f1f", height:"29px", borderBottomRightRadius:"10px",borderTopRightRadius:"10px",border:"solid 2px #454545", borderLeft:"0"}}>
            <option value="referencia">Reference</option>
            <option value="compatibilidad">Name</option>
            <option value="marca">Brand</option>
            <option value="modelo">Model</option>
            
      </select>
    </div>

        <div style={{display:"flex",gap:"40px",alignItems:"center"}}>
        <button style={{cursor:"pointer",height:"28px",width:"70px",background:"#1f1f1f", color:"white",outline:"0",border:"solid 2px #454545", borderRadius:"7px"}} className='anadir' onClick={()=>{document.getElementById("modal").classList.add("modal"); document.getElementById("modal").classList.remove("modalfadeout");var a=document.getElementById("modal").querySelectorAll("input"); for (const x of a){x.value=""};}} >Add</button>
        
        </div>
        </div>
      <div className='Tabla' style={{ display: "flex", justifyContent: "center", fontSize: "20px", borderCollapse: "collapse", color: "white"}}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ height: "40px" }}>
              <th style={{ width: "14%" }}>Name</th>
              <th style={{ width: "14%" }}>Brand</th>
              <th style={{ width: "14%" }}>Model</th>
              <th style={{ width: "14%" }}>Reference</th>
              <th style={{ width: "14%" }}>Quantity 1</th>
              <th style={{ width: "14%" }}>Quantity 2</th>
              <th style={{ width: "14%" }}>{/*Buttons space*/}</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => ( // Utilizes map to iterate through each array object and generate a row with all the Firebase content. The buttons contain the item.alref, which serves as the key for the object, allowing you to iterate and retrieve data from the buttons.
              <tr className='fila' data-alref={item.alref} key={index} style={{ textAlign: "center", marginTop: "20px" }} onClick={(event) => seleccionar(event)} onMouseOver={(event) => mostrarbotones(event)} onMouseLeave= {(event) => ocultarbotones(event)} >
                <td>{item.compatibilidad}</td>
                <td>{item.marca}</td>
                <td>{item.modelo}</td>
                <td>{item.referencia}</td>
                <td><div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center",gap:"10px"}}><button data-valor = {item.cantidad_garage} onClick={(event) => restar(event)} data-garofur = "gar" data-alref = {item.alref} className='botonmenos'><img style={{width:"13px"}} src="\menoss.png" alt="" /></button><p className='numeros'>{item.cantidad_garage}</p><button data-valor = {item.cantidad_garage} data-garofur = "gar" data-alref = {item.alref} className='botonmenos' onClick={(event) => sumar(event)}><img style={{width:"13px"}} src="\mesi.png" alt=""  /></button></div></td>
                <td><div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center",gap:"10px"}}><button data-valor = {item.cantidad_furgo} onClick={(event) => restar(event)} data-garofur = "fur" data-alref = {item.alref} className='botonmenos'><img style={{width:"13px"}} src="\menoss.png" alt="" /></button><p className='numeros'>{item.cantidad_furgo}</p><button data-valor = {item.cantidad_furgo} data-garofur = "fur" data-alref = {item.alref} className='botonmenos' onClick={(event) => sumar(event)}><img style={{width:"13px"}} src="\mesi.png" alt="" /></button></div></td> 
                <td><div style={{display:"flex",justifyContent:"center",gap:"20px"}}><button data-alref = {item.alref} onClick={(event)=>eliminar(event)} className='botonselect'>Remove</button><button onClick={(event)=>mod(event)} data-alref = {item.alref} className='botonselect'>Edit</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  
}

export default Tabla;
