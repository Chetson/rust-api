export default function Login () {
    const params = new URLSearchParams({
        'openid.ns': 'http://specs.openid.net/auth/2.0',
        'openid.mode': 'checkid_setup',
        'openid.return_to': import.meta.env.VITE_BASE_URL + 'auth/signin',
        'openid.realm': import.meta.env.VITE_BASE_URL,
        'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
        'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select'
    })

    window.location.assign(`https://steamcommunity.com/openid/login?${params.toString()}`)
}
