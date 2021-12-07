let modalQt = 1;
let cart= [];
let Modalkey;

//Listagem das Pizzas
pizzaJson.map((item,index)=>{
    let pizzaitem = document.querySelector('.models .pizza-item').cloneNode(true);

    pizzaitem.setAttribute('data-key',index);
    pizzaitem.querySelector('.pizza-item--img img').src = item.img;
    pizzaitem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaitem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaitem.querySelector('.pizza-item--price').innerHTML = `R$: ${item.price.toFixed(2)}`;
    pizzaitem.querySelector('a').addEventListener('click',(e)=>{
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt=1;
        Modalkey=key;
        document.querySelector('.pizzaInfo h1').innerHTML=pizzaJson[key].name;
        document.querySelector('.pizzaInfo--desc').innerHTML=pizzaJson[key].description;
        document.querySelector('.pizzaBig img').src=pizzaJson[key].img;
        document.querySelector('.pizzaInfo--actualPrice').innerHTML=`R$: ${pizzaJson[key].price.toFixed(2)}`
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected')
       
        document.querySelectorAll('.pizzaInfo--size').forEach((size,sizeindex)=>{
            if(sizeindex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML=pizzaJson[key].sizes[sizeindex];

        });
        document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;
        document.querySelector('.pizzaWindowArea').style.opacity=0;
        document.querySelector('.pizzaWindowArea').style.display='flex';
        setTimeout(()=>{
            document.querySelector('.pizzaWindowArea').style.opacity=1;
        },300);

    })


    document.querySelector('.pizza-area').append(pizzaitem)

});
//Eventos Modal
function closeModal(){
    document.querySelector('.pizzaWindowArea').style.opacity=0;
    setTimeout(()=>{
        document.querySelector('.pizzaWindowArea').style.display='none';
    },300);

}
//Evento
document.querySelectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) =>{
    item.addEventListener('click', closeModal)
})
//Evento
document.querySelector('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt --;
        document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;
    }
    
    
});
//Evento
document.querySelector('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt ++;
    document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;
});
//Evento
document.querySelectorAll('.pizzaInfo--size').forEach((size,sizeindex)=>{
    size.addEventListener('click',(e)=>{
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    })
});
//Evento
document.querySelector('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key'));
   
    let identifier = pizzaJson[Modalkey].id+'@'+size;
    
    let key = cart.findIndex((item)=>item.identifier==identifier);
    
    if(key >-1){
        cart[key].qt+= modalQt;
    }
    else{

        cart.push({
            identifier,
            id:pizzaJson[Modalkey].id,
            size,
            qt:modalQt
        })
    }
    updateCart();
    closeModal();
});

document.querySelector('.menu-openner').addEventListener('click',()=>{
    if(cart.length > 0){
        document.querySelector('aside').style.left='0';
    }
})
document.querySelector('.menu-closer').addEventListener('click',()=>{
    
        document.querySelector('aside').style.left='100vw';
    
})

//Atualizar Carrinho
function updateCart(){
    document.querySelector('.menu-openner span').innerHTML=cart.length;

    if(cart.length > 0){
        document.querySelector('aside').classList.add('show');
        document.querySelector('.cart').innerHTML ='';
        let subtotal =0;
        let desconto =0;
        let total =0;
        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = document.querySelector('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            cartItem.querySelector('img').src=pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',() =>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else{
                    cart.splice(i,1);
                }
                updateCart();

            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',() =>{
                cart[i].qt++;
                updateCart();

            });

            document.querySelector('.cart').append(cartItem);
        }

        desconto = subtotal *0.1;
        total = subtotal-desconto;
        document.querySelector('.subtotal span:last-child').innerHTML=`R$: ${subtotal.toFixed(2)}`
        document.querySelector('.desconto span:last-child').innerHTML=`R$: ${desconto.toFixed(2)}`
        document.querySelector('.total span:last-child').innerHTML=`R$: ${total.toFixed(2)}`

    }
    else{
        document.querySelector('aside').classList.remove('show');
        document.querySelector('aside').style.left='100vw';
    }
}