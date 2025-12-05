export interface IOptions {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
}
type ICalculatedResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
};
declare const calculatePagination: (options: IOptions) => ICalculatedResult;
export default calculatePagination;
//# sourceMappingURL=paginations.d.ts.map