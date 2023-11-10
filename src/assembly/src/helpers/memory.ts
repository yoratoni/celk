/**
 * Imitates a single section of a memory slot.
 */
export class IsMemorySlotSection {
    constructor(public offset: u64, public bytes: u64, public end: u64) { }
}

/**
 * Imitates a single memory slot.
 */
export class IsMemorySlot {
    constructor(public readFrom: IsMemorySlotSection, public writeTo: IsMemorySlotSection) { }
}