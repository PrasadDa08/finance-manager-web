export function isMobileApp(){
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}