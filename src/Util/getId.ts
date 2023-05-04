export const baseId = 'uk.co.davidsev.dndaoe';

export default function getId (id ?: string): string {
    if (id)
        return `${baseId}/${id}`;
    else
        return baseId;
}
