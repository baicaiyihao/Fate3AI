
const array = [9,2,3,52]

for(let i=0;i<array.length-1;i++){
    for(let k=i+1;k<array.length-2;k++){
        if(array[i]<array[k]){
            array[i]=array[k];
            k=i;
            i+=1;
        }
            
    }
}

