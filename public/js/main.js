window.addEventListener('DOMContentLoaded', (e) =>{
    fetch('http://localhost:3000/getall')
    .then(res => res.json())
    .then(data =>{
        if(data.response === 'success'){
            const todos = data.data;

            todos.forEach(todo =>{
                document.querySelector('#todos').innerHTML += `
                <div class='todo' id='${todo._id}'>
                    <div class="checkbox-container"><input type="checkbox" class="complete-checkbox" name="" id="" ${(todo.completed === true)? 'checked': ''}></div>
                    <div class="text-container ${(todo.completed === true)? 'completed': ''}">${todo.text}</div>
                    <div class="actions-container"><a href='/delete/${todo._id}'>X</a></div>
                </div>
                `;
            });
        }

        mapCheckboxes();

        
    })
    .catch(err => console.error(err));
});

const mapCheckboxes = () =>{
    document.querySelectorAll('.complete-checkbox').forEach(item =>{
        item.addEventListener('click', async e => {
            const id = e.target.parentNode.parentNode.id;
            let classes = e.target.parentNode.parentNode.childNodes[3].className.replace('completed', '').trim();
            const completed = e.target.checked;

            const res = await updateTodo(id, completed);

            if(res.response === 'success'){
                if(completed){
                    e.target.parentNode.parentNode.childNodes[3].className += 'completed';
                   }else{
                    e.target.parentNode.parentNode.childNodes[3].className = classes;
                   }
            }
        });
     });
}

const updateTodo = async (id, completed) =>{
    const res = await fetch('http://localhost:3000/complete/' + id + '/' + completed)
                        .then(res => res.json());

    
    return res;
}

