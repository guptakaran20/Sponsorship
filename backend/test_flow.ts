

const API = 'http://localhost:5000/api';

async function run() {
    try {
        console.log("=== REGISTER CLUB ===");
        const clubRes = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: `club${Date.now()}@test.com`, password: 'password', name: 'Test Club', role: 'CLUB' })
        });
        const clubData = await clubRes.json();
        console.log(clubData);
        const clubToken = clubData.token;

        console.log("=== CREATE CLUB PROFILE ===");
        const cpRes = await fetch(`${API}/clubs/profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${clubToken}` },
            body: JSON.stringify({ collegeName: 'Test College', description: 'desc', reach: 100 })
        });
        console.log(await cpRes.json());

        console.log("=== CREATE EVENT ===");
        const evRes = await fetch(`${API}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${clubToken}` },
            body: JSON.stringify({
                name: 'Test Event', description: 'Desc', eventType: 'Hackathon', location: 'Here', date: '2027-01-01',
                tiers: [{ name: 'Gold', amount: "100", benefits: ['Logo'] }]
            })
        });
        const evData = await evRes.json();
        console.log(evData);
        const eventId = evData.id;
        const tierId = evData.tiers[0].id;

        console.log("=== FETCH CLUB EVENTS ===");
        const fetchEvRes = await fetch(`${API}/clubs/profile`, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${clubToken}` },
        });
        const profileData = await fetchEvRes.json();
        console.log('Profile Events:', profileData.events?.length);
        if (!profileData.events) console.log(profileData);

        console.log("=== REGISTER COMPANY ===");
        const compRes = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: `comp${Date.now()}@test.com`, password: 'password', name: 'Test Company', role: 'COMPANY' })
        });
        const compData = await compRes.json();
        console.log(compData);
        const compToken = compData.token;

        console.log("=== CREATE COMPANY PROFILE ===");
        const cppRes = await fetch(`${API}/companies/profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${compToken}` },
            body: JSON.stringify({ industry: 'Tech', companySize: '10-50' })
        });
        console.log(await cppRes.json());

        console.log("=== CREATE DEAL ===");
        const dealRes = await fetch(`${API}/deals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${compToken}` },
            body: JSON.stringify({ eventId, tierId })
        });
        const dealData = await dealRes.json();
        console.log(dealData);
        const dealId = dealData.id;

        console.log("=== ACCEPT DEAL ===");
        const acceptRes = await fetch(`${API}/deals/${dealId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${clubToken}` },
            body: JSON.stringify({ status: 'ACCEPTED' })
        });
        const acceptData = await acceptRes.json();
        console.log(acceptData);
        const dealPin = acceptData.dealPin; // In reality, we must fetch from company

        console.log("=== FETCH COMP DEALS ===");
        const fetchDealsRes = await fetch(`${API}/deals`, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${compToken}` },
        });
        const dealsData = await fetchDealsRes.json();
        console.log('Company Deals:', dealsData);

        console.log("=== FETCH CLUB DEALS ===");
        const fetchCDealsRes = await fetch(`${API}/deals`, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${clubToken}` },
        });
        const cdealsData = await fetchCDealsRes.json();
        console.log('Club Deals:', cdealsData);

        console.log("=== VERIFY DEAL ===");
        const verifyRes = await fetch(`${API}/deals/${dealId}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${clubToken}` },
            body: JSON.stringify({ pin: dealPin || dealsData[0].dealPin })
        });
        console.log(await verifyRes.json());

    } catch (e) {
        console.error(e);
    }
}
run();
