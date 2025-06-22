document.addEventListener('DOMContentLoaded', () => { // รอให้ DOM โหลดเสร็จแล้วค่อยทำงาน
    const taskInput = document.getElementById('todo-input'); // ช่องกรอก task
    const addTaskBtn = document.getElementById('add-task-btn'); // ปุ่มเพิ่ม task
    const todoList = document.getElementById('task-list'); // ul รายการ task
    const todosContainer = document.getElementById('todos-container'); // container ของ task ทั้งหมด
    const progressBar = document.getElementById('progress'); // progress bar
    const progressNumber = document.getElementById('numbers'); // ตัวเลขแสดงจำนวน task

    const toggleEmptyState = () => { // ฟังก์ชันปรับขนาด container ถ้ามี/ไม่มี task
        todosContainer.style.width = todoList.children.length > 0 ? '100%' : '50%'; // ถ้ามี task ให้กว้าง 100% ถ้าไม่มีให้ 50%
    };

    const updateProgress = (checkCompleation = true) => { // ฟังก์ชันอัปเดต progress bar และตัวเลข
        const totalTasks = todoList.children.length; // จำนวน task ทั้งหมด
        const completedTasks = todoList.querySelectorAll('.checkbox:checked').length; // จำนวน task ที่ทำเสร็จ

        progressBar.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%` : '0%'; // ปรับความกว้าง progress bar
        progressNumber.textContent = `${completedTasks} / ${totalTasks}`; // อัปเดตตัวเลข

        if(checkCompleation && totalTasks > 0 && completedTasks === totalTasks) { // ถ้าทำครบทุก task
            Confetti2(); // แสดง confetti แบบหัวใจ
            Confetti(); // แสดง confetti แบบปกติ
            showHBD(); // แสดงข้อความ HBD
        }
    };

    const addTask = (text, completed = false, checkCompleation = true) => { // ฟังก์ชันเพิ่ม task ใหม่
        const taskText = text || taskInput.value.trim(); // รับข้อความจาก argument หรือ input
        if (!taskText) { // ถ้าไม่มีข้อความ
            updateProgress(); // อัปเดต progress bar
            return; // ออกจากฟังก์ชัน
        }

        const newTask = document.createElement('li'); // สร้าง element <li> ใหม่
        newTask.innerHTML = ` 
            <input type="checkbox" class="checkbox"${completed ? ' checked' : ''}> 
            <span>${taskText}</span> 
            <div class="task-buttons"> 
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        const checkbox = newTask.querySelector('.checkbox'); // เลือก checkbox ของ task นี้
        const editBtn = newTask.querySelector('.edit-btn'); // เลือกปุ่ม edit ของ task นี้

        if(completed){ // ถ้า task นี้ถูกทำเสร็จแล้ว
            newTask.classList.add('completed'); // เพิ่มคลาส completed
            editBtn.disabled = true; // ปิดการใช้งานปุ่ม edit
            editBtn.style.opacity = '0.5'; // ทำให้ปุ่มจางลง
            editBtn.style.pointerEvents = 'none'; // ไม่ให้คลิกได้
            updateProgress(); // อัปเดต progress bar
        }

        checkbox.addEventListener('change', () => { // เมื่อมีการเปลี่ยนสถานะ checkbox
            const isChecked = checkbox.checked; // ตรวจสอบว่า checked หรือไม่
            newTask.classList.toggle('completed', isChecked); // เพิ่ม/ลบคลาส completed
            editBtn.disabled = isChecked; // ปิด/เปิดปุ่ม edit ตามสถานะ
            editBtn.style.opacity = isChecked ? '0.5' : '1'; // ปรับความจางของปุ่ม edit
            editBtn.style.pointerEvents = isChecked ? 'none' : 'auto'; // ปรับให้คลิกได้หรือไม่
            updateProgress(); // อัปเดต progress bar
        });

        editBtn.addEventListener('click', () => { // เมื่อคลิกปุ่ม edit
            if(!checkbox.checked) { // ถ้า task ยังไม่ถูกทำเสร็จ
                taskInput.value = newTask.querySelector('span').textContent; // ใส่ข้อความ task ลง input
                newTask.remove(); // ลบ task ออกจาก list
                toggleEmptyState(); // อัปเดตสถานะถ้า list ว่าง
                updateProgress(false); // อัปเดต progress bar โดยไม่เช็ค completion effect
            }
        });

        newTask.querySelector('.delete-btn').addEventListener('click', () => { // เมื่อคลิกปุ่มลบ
            newTask.remove(); // ลบ task ออกจาก list
            toggleEmptyState(); // อัปเดตสถานะถ้า list ว่าง
            updateProgress(); // อัปเดต progress bar
        });

        todoList.appendChild(newTask); // เพิ่ม task ใหม่เข้า ul
        taskInput.value = ''; // ล้าง input
        toggleEmptyState(); // อัปเดตสถานะถ้า list ว่าง
        updateProgress(); // อัปเดต progress bar
    };

    addTaskBtn.addEventListener('click', () => addTask()); // เมื่อคลิกปุ่มเพิ่ม task
    taskInput.addEventListener('keypress', (e) => { // เมื่อกดปุ่มใน input
        if (e.key === 'Enter') { // ถ้ากด Enter
            e.preventDefault(); // ป้องกันการ submit form
            addTask(); // เพิ่ม task
        }
    });
});

const Confetti = () => { // ฟังก์ชันแสดง confetti แบบปกติ
    const duration = 15 * 1000, // ระยะเวลา 15 วินาที
        animationEnd = Date.now() + duration, // เวลาสิ้นสุด
        defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }; // ค่าตั้งต้น

    function randomInRange(min, max) { 
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() { 
        const timeLeft = animationEnd - Date.now(); 

        if (timeLeft <= 0) {
            return clearInterval(interval); 
        }

        const particleCount = 50 * (timeLeft / duration); 

        
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            })
        );
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            })
        );
    }, 250);
};

const Confetti2 = () => { 
    const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["heart"],
        colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
    };

    confetti({
        ...defaults,
        particleCount: 50,
        scalar: 2,
    });

    confetti({
        ...defaults,
        particleCount: 25,
        scalar: 3,
    });

    confetti({
        ...defaults,
        particleCount: 10,
        scalar: 4,
    });
};

function showHBD() { // ฟังก์ชันแสดงข้อความ HBD กลางจอ
    const hbdDiv = document.createElement('div'); // สร้าง div ใหม่
    hbdDiv.id = 'hbd-message'; // ตั้ง id
    hbdDiv.innerText = '🎉Happy Birthday🎉'; // ข้อความที่จะแสดง
    document.body.appendChild(hbdDiv); // เพิ่ม div เข้า body

    setTimeout(() => { // ตั้งเวลาให้ลบ div ออก
        hbdDiv.remove();
    }, 26000); // ลบหลัง 26 วินาที
}