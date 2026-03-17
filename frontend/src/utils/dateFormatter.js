export const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    // Get day, month, and year
    const day = date.getDate();
    const month = date.toLocaleDateString('en-GB', { month: 'long' });
    const year = date.getFullYear();

    // Function to get the ordinal suffix (st, nd, rd, th)
    const getOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return `${getOrdinal(day)} ${month}, ${year}`;
};