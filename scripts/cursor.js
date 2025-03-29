// Export the setupCursor function
export function setupCursor() {
    // Custom tech cursor implementation
    document.addEventListener('DOMContentLoaded', () => {
        const cursor = document.createElement('div');
        cursor.classList.add('cursor-container');
        cursor.innerHTML = `
        <div class="cursor">
            <div class="cursor-outer"></div>
            <div class="cursor-inner"></div>
        </div>
    `;
        document.body.appendChild(cursor);

        const cursorOuter = cursor.querySelector('.cursor-outer');
        const cursorInner = cursor.querySelector('.cursor-inner');
        const cursorElement = cursor.querySelector('.cursor');

        // Add cursor toggle button
        const cursorToggle = document.createElement('button');
        cursorToggle.classList.add('cursor-toggle');
        cursorToggle.innerHTML = '<i class="fas fa-mouse-pointer"></i>';
        document.body.appendChild(cursorToggle);

        // Toggle custom cursor
        cursorToggle.addEventListener('click', () => {
            document.body.classList.toggle('disable-custom-cursor');
        });

        // Update cursor position
        document.addEventListener('mousemove', (e) => {
            cursorOuter.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            cursorInner.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;

            // Check if cursor is over a link or button
            const target = e.target;
            if (target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.classList.contains('action-btn') ||
                target.parentElement.classList.contains('action-btn')) {
                cursorElement.classList.add('link-grow');
            } else {
                cursorElement.classList.remove('link-grow');
            }
        });

        // Add click effect
        document.addEventListener('mousedown', () => {
            cursorElement.classList.add('clicking');
        });

        document.addEventListener('mouseup', () => {
            cursorElement.classList.remove('clicking');
        });

        // Handle cursor for text inputs
        const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
        textInputs.forEach(input => {
            input.addEventListener('mouseenter', () => {
                cursorElement.classList.add('text');
            });

            input.addEventListener('mouseleave', () => {
                cursorElement.classList.remove('text');
            });
        });

        // Hide cursor when it leaves the window
        document.addEventListener('mouseleave', () => {
            cursorElement.classList.add('hidden');
        });

        document.addEventListener('mouseenter', () => {
            cursorElement.classList.remove('hidden');
        });
    });



}
