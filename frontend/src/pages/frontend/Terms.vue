<template>
    <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-5xl mx-auto">

            <div class="text-center mb-12">
                <h1 class="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight mb-3">
                    Legal Information & Policies
                </h1>
                <p class="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
                    Please review the official, comprehensive Privacy Policy and Terms & Conditions governing the use of
                    the Administrative Training Institute (ATI) Mizoram application.
                </p>
            </div>

            <div class="flex justify-center mb-8 border-b border-zinc-200 dark:border-white/10">
                <button @click="activeTab = 'privacy'" :class="[
                    activeTab === 'privacy'
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:border-zinc-300'
                ]"
                    class="px-8 py-4 border-b-2 font-bold text-sm sm:text-base transition-colors flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Privacy Policy
                </button>
                <button @click="activeTab = 'terms'" :class="[
                    activeTab === 'terms'
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:border-zinc-300'
                ]"
                    class="px-8 py-4 border-b-2 font-bold text-sm sm:text-base transition-colors flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Terms & Conditions
                </button>
            </div>

            <div
                class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden">

                <div v-if="activeTab === 'privacy'" class="p-8 sm:p-12 prose prose-zinc dark:prose-invert max-w-none">
                    <p
                        class="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                        Effective Date: May 19, 2026</p>

                    <h2 class="text-2xl font-bold text-zinc-900 dark:text-white mt-0">1. Introduction and Scope</h2>
                    <p class="text-zinc-900 dark:text-white">
                        The Administrative Training Institute (ATI), Government of Mizoram ("we", "us", "our"), respects
                        your privacy and is committed to protecting the personal and professional data of all users
                        interacting with the ATIMZ application. This comprehensive Privacy Policy outlines our practices
                        regarding the collection, storage, processing, and sharing of information when you use our
                        platform for training enrollment, management, and certification.
                    </p>
                    <p class="text-zinc-900 dark:text-white">
                        By accessing or using the ATIMZ application, you consent to the data practices described in this
                        policy, which aligns with applicable data protection guidelines and the Information Technology
                        Act, 2000.
                    </p>

                    <h2 class="text-2xl font-bold text-zinc-900 dark:text-white">2. Categories of Information Collected
                    </h2>
                    <p class="text-zinc-900 dark:text-white">To deliver a highly functional and secure administrative
                        platform, we
                        collect the following
                        categories of data:</p>
                    <ul class="space-y-2 text-zinc-600 dark:text-zinc-300">
                        <li><strong>Identity and Contact Data:</strong> Full legal name, official designation, parent
                            department/directorate, official email address, and registered mobile number.</li>
                        <li><strong>Training and Performance Data:</strong> Course nominations, attendance logs,
                            assessment results, mandatory training due dates, waitlist statuses, and historical training
                            records.</li>
                        <li><strong>Authentication and Signature Data:</strong> Encrypted passwords, session tokens, and
                            cryptographic artifacts necessary for digital signature integrations (e.g., eMudhra hardware
                            token details used by authorized officials).</li>
                        <li><strong>Technical and Log Data:</strong> IP addresses, browser types, operating systems,
                            access timestamps, and interaction logs. This data is collected automatically to maintain
                            system security, monitor performance, and audit user actions.</li>
                    </ul>

                    <h2 class="text-2xl font-bold text-zinc-900 dark:text-white">3. Purposes of Data Processing</h2>
                    <p class="text-zinc-900 dark:text-white">The information we collect is strictly utilized for the
                        following official purposes:</p>
                    <ul class="space-y-2 text-zinc-600 dark:text-zinc-300">
                        <li><strong>Service Delivery:</strong> To process enrollments, manage training rosters, and
                            issue official communications regarding training schedules.</li>
                        <li><strong>Document Generation:</strong> To dynamically generate and validate official Office
                            Orders, Release Orders, and Certificates of Completion, which form part of the official
                            Service Book/Card of the trainee.</li>
                        <li><strong>Security and Fraud Prevention:</strong> To authenticate users, prevent unauthorized
                            access, and digitally sign documents to ensure non-repudiation and integrity.</li>
                        <li><strong>Analytics and Auditing:</strong> To generate aggregated, anonymized reports for
                            government oversight, evaluate training effectiveness, and fulfill statutory auditing
                            requirements.</li>
                    </ul>

                    <h2 class="text-2xl font-bold text-zinc-900 dark:text-white">4. Data Sharing and Third-Party
                        Disclosures</h2>
                    <p class="text-zinc-900 dark:text-white">As a government application, data privacy is paramount. We
                        do not engage in commercial data
                        sharing, selling, or renting. Data is only disclosed under the following circumstances:</p>
                    <ul class="space-y-2 text-zinc-600 dark:text-zinc-300">
                        <li><strong>Inter-Departmental Sharing:</strong> Information is shared with controlling
                            officers, Heads of Departments, and the DP&AR (GG & Training Wing) strictly for the purpose
                            of relieving officials for training and updating service records.</li>
                        <li><strong>Authorized Service Providers:</strong> Information may be securely transmitted to
                            recognized third-party gateways strictly for required functionalities (e.g., transmitting
                            document hashes to the eMudhra gateway for e-signatures). These providers are bound by
                            strict confidentiality agreements.</li>
                        <li><strong>Legal Compliance:</strong> We may disclose information if mandated by law, court
                            order, or lawful requests by law enforcement agencies or statutory bodies.</li>
                    </ul>

                    <h2 class="text-2xl font-bold text-zinc-900 dark:text-white">5. Data Retention and Storage</h2>
                    <p class="text-zinc-900 dark:text-white">
                        All data collected by the ATIMZ application is hosted on secure servers located within India. We
                        retain personal and training data for as long as necessary to fulfill the administrative
                        purposes outlined in this policy, or as mandated by the Government of Mizoram's record retention
                        schedules. Official generated documents (PDFs) and their cryptographic signatures are stored
                        indefinitely as official government records.
                    </p>

                    <h2 class="text-2xl font-bold text-zinc-900 dark:text-white">6. Security Measures</h2>
                    <p class="text-zinc-900 dark:text-white">
                        We deploy multiple layers of security to protect your data, including end-to-end encryption
                        (HTTPS/TLS), role-based access control (RBAC), secure password hashing, and periodic
                        vulnerability assessments. Despite these measures, no electronic transmission or storage system
                        is entirely foolproof. Users are urged to maintain the confidentiality of their credentials.
                    </p>

                    <h2 class="text-2xl font-bold text-zinc-900 dark:text-white">7. User Rights and Data Accuracy</h2>
                    <p class="text-zinc-900 dark:text-white">
                        Users are responsible for ensuring their profile information (Designation, Department) is
                        accurate. Inaccuracies may result in defective certificates. If your data requires correction,
                        please contact your departmental nodal officer or the ATI system administrator to initiate an
                        update.
                    </p>

                    <h2 class="text-2xl font-bold text-zinc-900 dark:text-white">8. Grievance Redressal</h2>
                    <p class="text-zinc-900 dark:text-white">
                        For any concerns regarding data privacy or the handling of your information within the ATIMZ
                        application, please contact the designated System Administrator at the Administrative Training
                        Institute, Aizawl, Mizoram.
                    </p>
                </div>

                <div v-if="activeTab === 'terms'" class="p-8 sm:p-12 prose prose-zinc dark:prose-invert max-w-none">
                    <p
                        class="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                        Effective Date: May 19, 2026</p>

                    <h2 class="text-2xl font-bold text-zinc-900 dark:text-white mt-0">1. Acceptance and Applicability
                    </h2>
                    <p class="text-zinc-900 dark:text-white">
                        These Terms and Conditions ("Terms") constitute a legally binding agreement between you (the
                        "User") and the Administrative Training Institute, Government of Mizoram ("ATI Mizoram"),
                        regarding your access to and use of the ATIMZ application and its associated services. By
                        registering, logging in, or interacting with the platform, you acknowledge that you have read,
                        understood, and agree to be bound by these Terms.
                    </p>

                    <h2 class="text-2xl font-bold text-zinc-900 dark:text-white">2. User Accounts and Security</h2>
                    <ul class="space-y-2 text-zinc-600 dark:text-zinc-300">
                        <li><strong>Credential Confidentiality:</strong> Users are solely responsible for maintaining
                            the confidentiality of their login credentials. Any activity conducted under a user's
                            account is deemed to be authorized by that user.</li>
                        <li><strong>Authorized Access:</strong> Access to certain features (e.g., generating orders,
                            signing documents) is restricted to users with specific administrative or director-level
                            roles. Attempting to bypass access controls or escalate privileges is strictly prohibited
                            and subject to disciplinary action.</li>
                        <li><strong>Token Security:</strong> Officials utilizing USB cryptographic tokens (e.g., for
                            eMudhra signatures) are responsible for the physical security of their hardware and the
                            secrecy of their PINs.</li>
                    </ul>

                    <h2 class="text-2xl font-bold text-zinc-900 dark:text-white">3. Training Compliance and Attendance
                    </h2>
                    <p class="text-zinc-900 dark:text-white">The ATIMZ application is a tool to facilitate training, but
                        physical and procedural compliance
                        remains the responsibility of the trainee and their parent department:</p>
                    <ul class="space-y-2 text-zinc-600 dark:text-zinc-300">
                        <li><strong>Reporting:</strong> Selected candidates must report to the reception counter of the
                            ATI at the specified time and date.</li>
                        <li><strong>Consequences of Absence:</strong> Failure to attend a scheduled training without
                            prior written intimation to the Course Director will be recorded in the system and may
                            invite non-selection for future training courses.</li>
                        <li><strong>Certification:</strong> The issuance of a Completion Certificate is contingent upon
                            meeting minimum attendance requirements and passing end-of-course evaluations, as determined
                            by the Course Director.</li>
                    </ul>

                    <h2 class="text-2xl font-bold text-zinc-900 dark:text-white">4. Electronic Documents and Signatures
                    </h2>
                    <p class="text-zinc-900 dark:text-white">
                        The ATIMZ application generates official documents, including Release Orders, Annexures, and
                        Certificates.
                    </p>
                    <ul class="space-y-2 text-zinc-600 dark:text-zinc-300">
                        <li><strong>Legal Validity:</strong> Documents digitally signed through integrated gateways
                            (such as eMudhra) hold equal legal validity to physically signed documents under the
                            Information Technology Act, 2000.</li>
                        <li><strong>Immutability:</strong> Once a document is generated and signed, it becomes an
                            official, immutable record. Any attempt to tamper with, forge, or alter downloaded PDFs is
                            illegal.</li>
                        <li><strong>Service Records:</strong> Validly generated certificates are official proof of
                            training and must be positively entered into the respective official's Service Book/Card.
                        </li>
                    </ul>

                    <h2 class="text-2xl font-bold text-zinc-900 dark:text-white">5. Prohibited Activities</h2>
                    <p class="text-zinc-900 dark:text-white"> Users shall not engage in the following activities:</p>
                    <ul class="space-y-2 text-zinc-600 dark:text-zinc-300">
                        <li>Using the platform for any purpose other than official government training management.</li>
                        <li>Uploading malicious code, viruses, or attachments that could disrupt system functionality.
                        </li>
                        <li>Using automated scripts, scrapers, or bots to extract data from the application.</li>
                        <li>Providing false or misleading information during registration or nomination.</li>
                    </ul>

                    <h2 class="text-2xl font-bold text-zinc-900 dark:text-white">6. Intellectual Property Rights</h2>
                    <p class="text-zinc-900 dark:text-white">
                        All content, logos, source code, designs, and workflows within the ATIMZ application are the
                        intellectual property of the Government of Mizoram. Users are granted a limited, non-exclusive,
                        non-transferable license to use the platform solely for official duties. No part of the
                        application may be reproduced, distributed, or reverse-engineered.
                    </p>

                    <h2 class="text-2xl font-bold text-zinc-900 dark:text-white">7. Limitation of Liability and
                        Indemnification</h2>
                    <p class="text-zinc-900 dark:text-white">
                        <strong>Service Availability:</strong> ATI Mizoram endeavors to ensure 24/7 availability of the
                        application. However, the platform is provided on an "as-is" and "as-available" basis. We
                        reserve the right to suspend the application for planned maintenance or due to unforeseen
                        technical emergencies.
                    </p>
                    <p class="text-zinc-900 dark:text-white">
                        <strong>Liability Limit:</strong> In no event shall ATI Mizoram or the Government of Mizoram be
                        held liable for any direct, indirect, incidental, or consequential damages resulting from system
                        downtime, data transmission failures, or unauthorized access resulting from user negligence.
                    </p>

                    <h2 class="text-2xl font-bold text-zinc-900 dark:text-white">8. Amendments and Governing Law</h2>
                    <p class="text-zinc-900 dark:text-white">
                        <strong>Modifications:</strong> ATI Mizoram reserves the right to modify these Terms at any
                        time. Continued use of the platform following modifications signifies acceptance of the revised
                        Terms.
                    </p>
                    <p class="text-zinc-900 dark:text-white">
                        <strong>Jurisdiction:</strong> These Terms shall be governed by the laws of India and specific
                        directives issued by the Government of Mizoram. Any legal disputes arising from the use of the
                        ATIMZ application shall be subject to the exclusive jurisdiction of the competent courts in
                        Aizawl, Mizoram.
                    </p>
                </div>

            </div>

            <div class="mt-8 flex justify-center pb-12">
                <button @click="$router.back()"
                    class="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-xl transition-all shadow-sm active:scale-95">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Return to Previous Page
                </button>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeTab = ref('privacy'); // Default to Privacy Policy tab
</script>

<style scoped>
/* Scoped typography adjustments if needed, relying mostly on Tailwind's Typography plugin */
.prose {
    line-height: 1.75;
}

.prose h2 {
    border-bottom: 1px solid #f4f4f5;
    padding-bottom: 0.5rem;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
}

.dark .prose h2 {
    border-bottom-color: #27272a;
}

.prose ul li {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
}
</style>