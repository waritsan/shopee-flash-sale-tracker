function convertTimestamp(epochTimestamp) {
    const d = new Date(0)
    d.setUTCSeconds(epochTimestamp)
    return d
}

module.exports = convertTimestamp