function updateUserInfo() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (currentUser) {
        // Actualizar sidebar
        const profileName = document.getElementById('profile-name');
        const profileImg = document.getElementById('profile-img');
        
        if (profileName) {
            profileName.textContent = `${currentUser.name} ${currentUser.last_name}`;
        }
        
        if (profileImg) {
            const initials = currentUser.name.charAt(0) + currentUser.last_name.charAt(0);
            profileImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=8f141b&color=fff`;
        }
        
        // Actualizar vista start
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = `${currentUser.name} ${currentUser.last_name}`;
        }
    }
}