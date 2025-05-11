class SignatureController {
    constructor(signatureService) {
        this.signatureService = signatureService;
    }

    async createSignature(req, res) {
        try {
            const { documentId, userId } = req.body;
            const signature = await this.signatureService.createSignature(documentId, userId);
            res.status(201).json({ signature });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async verifySignature(req, res) {
        try {
            const { documentId, signature } = req.body;
            const isValid = await this.signatureService.verifySignature(documentId, signature);
            res.status(200).json({ isValid });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default SignatureController;