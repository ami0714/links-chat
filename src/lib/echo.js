import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

let echo;
let echoToken;

export function getEcho() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    if (!echo || echoToken !== token) {
        echo?.disconnect();

        const apiUrl = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_URL;
        const authEndpoint = import.meta.env.VITE_BROADCAST_AUTH_URL || (
            apiUrl ? new URL('/broadcasting/auth', apiUrl).toString() : '/broadcasting/auth'
        );

        echo = new Echo({
            broadcaster: 'reverb',
            key: import.meta.env.VITE_REVERB_APP_KEY,
            wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
            wsPort: Number(import.meta.env.VITE_REVERB_PORT || 80),
            wssPort: Number(import.meta.env.VITE_REVERB_PORT || 443),
            forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'http') === 'https',
            enabledTransports: ['ws', 'wss'],
            authEndpoint,
            auth: {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            },
        });
        echoToken = token;
    }

    return echo;
}