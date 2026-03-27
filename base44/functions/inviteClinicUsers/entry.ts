import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const emails = [
      "clinicamoema@vibeterapias.com",
      "clinicapaulista@vibeterapias.com",
      "clinicalondrina@vibeterapias.com",
      "clinicapinheiros@vibeterapias.com",
      "clinicaalphaville@vibeterapias.com",
      "clinicajardins@vibeterapias.com",
      "clinicacampinas@vibeterapias.com",
    ];

    const results = [];
    for (const email of emails) {
      try {
        await base44.asServiceRole.users.inviteUser(email, "admin");
        results.push({ email, status: "invited" });
      } catch (e) {
        results.push({ email, status: "error", message: e.message });
      }
    }

    return Response.json({ results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});