function collectData(request: any, callback: any): void {
    let data = '';
    request.on('data', (chunk: string) => {
        data += chunk;
    });
    request.on('end', () => {
        callback(JSON.parse(data));
    });
}

export default collectData;
