# AttendAI — Smart Attendance demo
Next.js App Router prototype with Student, Professor and Admin portals.

Run locally with npm install, then npm run dev. Visit http://localhost:3000. Open Admin, enter the demo password, and press Load sample class. Six fictional students and an open 2nd Year CSE-A session are created. Use Student to select a demo student and check in, then Professor to upload a classroom photo, reconcile, review flags and export a CSV report.

Demo credentials: professor@attendai.demo / AttendAI@123. Admin password: AttendAI@123. These are UI gates for a presentation only, not production authentication.

VISION_MODE defaults to stub. The photo upload returns the requested sample count of 7, but the stub does not examine image pixels. Connect a real people-detection model before claiming true image-based detection. Face templates and biometric fallback are simulated; no Touch ID, Face ID, fingerprint hardware or OS biometrics are used. Student notices poll every five seconds and are not push notifications. Store is in-memory and may reset on server restart; it is not production storage.
