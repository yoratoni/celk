(module
 (type $i32_=>_none (func (param i32)))
 (type $none_=>_none (func))
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $i32_i32_=>_none (func (param i32 i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (type $i32_i32_i32_i32_=>_none (func (param i32 i32 i32 i32)))
 (type $i32_i32_i64_=>_none (func (param i32 i32 i64)))
 (type $none_=>_i32 (func (result i32)))
 (type $i32_i32_i32_=>_none (func (param i32 i32 i32)))
 (type $i32_i64_i64_i64_=>_none (func (param i32 i64 i64 i64)))
 (type $i64_i64_i64_=>_none (func (param i64 i64 i64)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (global $~lib/rt/itcms/total (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/threshold (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/state (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/visitCount (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/pinSpace (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/iter (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/toSpace (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/white (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/fromSpace (mut i32) (i32.const 0))
 (global $~lib/rt/tlsf/ROOT (mut i32) (i32.const 0))
 (global $src/assembly/src/crypto/SHA256/instance (mut i32) (i32.const 0))
 (global $~lib/rt/__rtti_base i32 (i32.const 9488))
 (global $~lib/memory/__stack_pointer (mut i32) (i32.const 42292))
 (memory $0 64 64)
 (data $0 (i32.const 8204) "<")
 (data $0.1 (i32.const 8216) "\02\00\00\00(\00\00\00A\00l\00l\00o\00c\00a\00t\00i\00o\00n\00 \00t\00o\00o\00 \00l\00a\00r\00g\00e")
 (data $1 (i32.const 8268) "<")
 (data $1.1 (i32.const 8280) "\02\00\00\00 \00\00\00~\00l\00i\00b\00/\00r\00t\00/\00i\00t\00c\00m\00s\00.\00t\00s")
 (data $4 (i32.const 8396) "<")
 (data $4.1 (i32.const 8408) "\02\00\00\00$\00\00\00I\00n\00d\00e\00x\00 \00o\00u\00t\00 \00o\00f\00 \00r\00a\00n\00g\00e")
 (data $5 (i32.const 8460) ",")
 (data $5.1 (i32.const 8472) "\02\00\00\00\14\00\00\00~\00l\00i\00b\00/\00r\00t\00.\00t\00s")
 (data $7 (i32.const 8540) "<")
 (data $7.1 (i32.const 8552) "\02\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00t\00l\00s\00f\00.\00t\00s")
 (data $8 (i32.const 8604) "\1c\01")
 (data $8.1 (i32.const 8616) "\01\00\00\00\00\01\00\00\98/\8aB\91D7q\cf\fb\c0\b5\a5\db\b5\e9[\c2V9\f1\11\f1Y\a4\82?\92\d5^\1c\ab\98\aa\07\d8\01[\83\12\be\851$\c3}\0cUt]\ber\fe\b1\de\80\a7\06\dc\9bt\f1\9b\c1\c1i\9b\e4\86G\be\ef\c6\9d\c1\0f\cc\a1\0c$o,\e9-\aa\84tJ\dc\a9\b0\\\da\88\f9vRQ>\98m\c61\a8\c8\'\03\b0\c7\7fY\bf\f3\0b\e0\c6G\91\a7\d5Qc\ca\06g))\14\85\n\b7\'8!\1b.\fcm,M\13\r8STs\ne\bb\njv.\c9\c2\81\85,r\92\a1\e8\bf\a2Kf\1a\a8p\8bK\c2\a3Ql\c7\19\e8\92\d1$\06\99\d6\855\0e\f4p\a0j\10\16\c1\a4\19\08l7\1eLwH\'\b5\bc\b04\b3\0c\1c9J\aa\d8NO\ca\9c[\f3o.h\ee\82\8ftoc\a5x\14x\c8\84\08\02\c7\8c\fa\ff\be\90\eblP\a4\f7\a3\f9\be\f2xq\c6")
 (data $9 (i32.const 8892) "<")
 (data $9.1 (i32.const 8904) "\01\00\00\00 \00\00\00g\e6\tj\85\aeg\bbr\f3n<:\f5O\a5\7fR\0eQ\8ch\05\9b\ab\d9\83\1f\19\cd\e0[")
 (data $10 (i32.const 8956) ",")
 (data $10.1 (i32.const 8968) "\02\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h")
 (data $11 (i32.const 9004) "<")
 (data $11.1 (i32.const 9016) "\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s")
 (data $12 (i32.const 9068) "L")
 (data $12.1 (i32.const 9080) "\02\00\00\00<\00\00\00S\00H\00A\00-\002\005\006\00 \00e\00n\00g\00i\00n\00e\00 \00n\00o\00t\00 \00i\00n\00i\00t\00i\00a\00l\00i\00z\00e\00d")
 (data $13 (i32.const 9148) "\\")
 (data $13.1 (i32.const 9160) "\02\00\00\00B\00\00\00s\00r\00c\00/\00a\00s\00s\00e\00m\00b\00l\00y\00/\00s\00r\00c\00/\00c\00r\00y\00p\00t\00o\00/\00S\00H\00A\002\005\006\00.\00t\00s")
 (data $14 (i32.const 9244) "<")
 (data $14.1 (i32.const 9256) "\02\00\00\00$\00\00\00~\00l\00i\00b\00/\00t\00y\00p\00e\00d\00a\00r\00r\00a\00y\00.\00t\00s")
 (data $15 (i32.const 9308) ",")
 (data $15.1 (i32.const 9320) "\02\00\00\00\1a\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00.\00t\00s")
 (data $16 (i32.const 9356) "<")
 (data $16.1 (i32.const 9368) "\02\00\00\00*\00\00\00O\00b\00j\00e\00c\00t\00 \00a\00l\00r\00e\00a\00d\00y\00 \00p\00i\00n\00n\00e\00d")
 (data $17 (i32.const 9420) "<")
 (data $17.1 (i32.const 9432) "\02\00\00\00(\00\00\00O\00b\00j\00e\00c\00t\00 \00i\00s\00 \00n\00o\00t\00 \00p\00i\00n\00n\00e\00d")
 (data $18 (i32.const 9488) "\08\00\00\00 \00\00\00 \00\00\00 ")
 (data $18.1 (i32.const 9512) "\02\01\00\00\01\01\00\00\02\t")
 (export "sha256__execute" (func $src/assembly/src/crypto/SHA256/execute))
 (export "__new" (func $~lib/rt/itcms/__new))
 (export "__pin" (func $~lib/rt/itcms/__pin))
 (export "__unpin" (func $~lib/rt/itcms/__unpin))
 (export "__collect" (func $~lib/rt/itcms/__collect))
 (export "__rtti_base" (global $~lib/rt/__rtti_base))
 (export "memory" (memory $0))
 (start $~start)
 (func $~lib/rt/itcms/visitRoots
  (local $0 i32)
  (local $1 i32)
  i32.const 8416
  call $byn-split-outlined-A$~lib/rt/itcms/__visit
  i32.const 8976
  call $byn-split-outlined-A$~lib/rt/itcms/__visit
  i32.const 8224
  call $byn-split-outlined-A$~lib/rt/itcms/__visit
  i32.const 9376
  call $byn-split-outlined-A$~lib/rt/itcms/__visit
  i32.const 9440
  call $byn-split-outlined-A$~lib/rt/itcms/__visit
  global.get $src/assembly/src/crypto/SHA256/instance
  local.tee $0
  if
   local.get $0
   call $byn-split-outlined-A$~lib/rt/itcms/__visit
  end
  global.get $~lib/rt/itcms/pinSpace
  local.tee $1
  i32.load $0 offset=4
  i32.const -4
  i32.and
  local.set $0
  loop $while-continue|0
   local.get $0
   local.get $1
   i32.ne
   if
    local.get $0
    i32.load $0 offset=4
    i32.const 3
    i32.and
    i32.const 3
    i32.ne
    if
     i32.const 0
     i32.const 8288
     i32.const 160
     i32.const 16
     call $~lib/builtins/abort
     unreachable
    end
    local.get $0
    i32.const 20
    i32.add
    call $~lib/rt/__visit_members
    local.get $0
    i32.load $0 offset=4
    i32.const -4
    i32.and
    local.set $0
    br $while-continue|0
   end
  end
 )
 (func $~lib/rt/itcms/Object#unlink (param $0 i32)
  (local $1 i32)
  local.get $0
  i32.load $0 offset=4
  i32.const -4
  i32.and
  local.tee $1
  i32.eqz
  if
   local.get $0
   i32.load $0 offset=8
   i32.eqz
   local.get $0
   i32.const 42292
   i32.lt_u
   i32.and
   i32.eqz
   if
    i32.const 0
    i32.const 8288
    i32.const 128
    i32.const 18
    call $~lib/builtins/abort
    unreachable
   end
   return
  end
  local.get $0
  i32.load $0 offset=8
  local.tee $0
  i32.eqz
  if
   i32.const 0
   i32.const 8288
   i32.const 132
   i32.const 16
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  local.get $0
  i32.store $0 offset=8
  local.get $0
  local.get $1
  local.get $0
  i32.load $0 offset=4
  i32.const 3
  i32.and
  i32.or
  i32.store $0 offset=4
 )
 (func $~lib/rt/itcms/Object#makeGray (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  global.get $~lib/rt/itcms/iter
  i32.eq
  if
   local.get $0
   i32.load $0 offset=8
   local.tee $1
   i32.eqz
   if
    i32.const 0
    i32.const 8288
    i32.const 148
    i32.const 30
    call $~lib/builtins/abort
    unreachable
   end
   local.get $1
   global.set $~lib/rt/itcms/iter
  end
  local.get $0
  call $~lib/rt/itcms/Object#unlink
  global.get $~lib/rt/itcms/toSpace
  local.set $1
  local.get $0
  i32.load $0 offset=12
  local.tee $2
  i32.const 2
  i32.le_u
  if (result i32)
   i32.const 1
  else
   local.get $2
   i32.const 9488
   i32.load $0
   i32.gt_u
   if
    i32.const 8416
    i32.const 8480
    i32.const 21
    i32.const 28
    call $~lib/builtins/abort
    unreachable
   end
   local.get $2
   i32.const 2
   i32.shl
   i32.const 9492
   i32.add
   i32.load $0
   i32.const 32
   i32.and
  end
  local.set $3
  local.get $1
  i32.load $0 offset=8
  local.set $2
  local.get $0
  global.get $~lib/rt/itcms/white
  i32.eqz
  i32.const 2
  local.get $3
  select
  local.get $1
  i32.or
  i32.store $0 offset=4
  local.get $0
  local.get $2
  i32.store $0 offset=8
  local.get $2
  local.get $0
  local.get $2
  i32.load $0 offset=4
  i32.const 3
  i32.and
  i32.or
  i32.store $0 offset=4
  local.get $1
  local.get $0
  i32.store $0 offset=8
 )
 (func $~lib/rt/tlsf/removeBlock (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $1
  i32.load $0
  local.tee $2
  i32.const 1
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 8560
   i32.const 268
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $2
  i32.const -4
  i32.and
  local.tee $2
  i32.const 12
  i32.lt_u
  if
   i32.const 0
   i32.const 8560
   i32.const 270
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $2
  i32.const 256
  i32.lt_u
  if (result i32)
   local.get $2
   i32.const 4
   i32.shr_u
  else
   i32.const 31
   i32.const 1073741820
   local.get $2
   local.get $2
   i32.const 1073741820
   i32.ge_u
   select
   local.tee $2
   i32.clz
   i32.sub
   local.tee $4
   i32.const 7
   i32.sub
   local.set $3
   local.get $2
   local.get $4
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
  end
  local.tee $2
  i32.const 16
  i32.lt_u
  local.get $3
  i32.const 23
  i32.lt_u
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 8560
   i32.const 284
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.load $0 offset=8
  local.set $5
  local.get $1
  i32.load $0 offset=4
  local.tee $4
  if
   local.get $4
   local.get $5
   i32.store $0 offset=8
  end
  local.get $5
  if
   local.get $5
   local.get $4
   i32.store $0 offset=4
  end
  local.get $1
  local.get $0
  local.get $3
  i32.const 4
  i32.shl
  local.get $2
  i32.add
  i32.const 2
  i32.shl
  i32.add
  i32.load $0 offset=96
  i32.eq
  if
   local.get $0
   local.get $3
   i32.const 4
   i32.shl
   local.get $2
   i32.add
   i32.const 2
   i32.shl
   i32.add
   local.get $5
   i32.store $0 offset=96
   local.get $5
   i32.eqz
   if
    local.get $0
    local.get $3
    i32.const 2
    i32.shl
    i32.add
    local.tee $1
    i32.load $0 offset=4
    i32.const -2
    local.get $2
    i32.rotl
    i32.and
    local.set $2
    local.get $1
    local.get $2
    i32.store $0 offset=4
    local.get $2
    i32.eqz
    if
     local.get $0
     local.get $0
     i32.load $0
     i32.const -2
     local.get $3
     i32.rotl
     i32.and
     i32.store $0
    end
   end
  end
 )
 (func $~lib/rt/tlsf/insertBlock (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $1
  i32.eqz
  if
   i32.const 0
   i32.const 8560
   i32.const 201
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.load $0
  local.tee $3
  i32.const 1
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 8560
   i32.const 203
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.const 4
  i32.add
  local.get $1
  i32.load $0
  i32.const -4
  i32.and
  i32.add
  local.tee $4
  i32.load $0
  local.tee $2
  i32.const 1
  i32.and
  if
   local.get $0
   local.get $4
   call $~lib/rt/tlsf/removeBlock
   local.get $1
   local.get $3
   i32.const 4
   i32.add
   local.get $2
   i32.const -4
   i32.and
   i32.add
   local.tee $3
   i32.store $0
   local.get $1
   i32.const 4
   i32.add
   local.get $1
   i32.load $0
   i32.const -4
   i32.and
   i32.add
   local.tee $4
   i32.load $0
   local.set $2
  end
  local.get $3
  i32.const 2
  i32.and
  if
   local.get $1
   i32.const 4
   i32.sub
   i32.load $0
   local.tee $1
   i32.load $0
   local.tee $6
   i32.const 1
   i32.and
   i32.eqz
   if
    i32.const 0
    i32.const 8560
    i32.const 221
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   local.get $0
   local.get $1
   call $~lib/rt/tlsf/removeBlock
   local.get $1
   local.get $6
   i32.const 4
   i32.add
   local.get $3
   i32.const -4
   i32.and
   i32.add
   local.tee $3
   i32.store $0
  end
  local.get $4
  local.get $2
  i32.const 2
  i32.or
  i32.store $0
  local.get $3
  i32.const -4
  i32.and
  local.tee $2
  i32.const 12
  i32.lt_u
  if
   i32.const 0
   i32.const 8560
   i32.const 233
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  local.get $1
  i32.const 4
  i32.add
  local.get $2
  i32.add
  i32.ne
  if
   i32.const 0
   i32.const 8560
   i32.const 234
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  i32.const 4
  i32.sub
  local.get $1
  i32.store $0
  local.get $2
  i32.const 256
  i32.lt_u
  if (result i32)
   local.get $2
   i32.const 4
   i32.shr_u
  else
   i32.const 31
   i32.const 1073741820
   local.get $2
   local.get $2
   i32.const 1073741820
   i32.ge_u
   select
   local.tee $2
   i32.clz
   i32.sub
   local.tee $3
   i32.const 7
   i32.sub
   local.set $5
   local.get $2
   local.get $3
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
  end
  local.tee $2
  i32.const 16
  i32.lt_u
  local.get $5
  i32.const 23
  i32.lt_u
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 8560
   i32.const 251
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $5
  i32.const 4
  i32.shl
  local.get $2
  i32.add
  i32.const 2
  i32.shl
  i32.add
  i32.load $0 offset=96
  local.set $3
  local.get $1
  i32.const 0
  i32.store $0 offset=4
  local.get $1
  local.get $3
  i32.store $0 offset=8
  local.get $3
  if
   local.get $3
   local.get $1
   i32.store $0 offset=4
  end
  local.get $0
  local.get $5
  i32.const 4
  i32.shl
  local.get $2
  i32.add
  i32.const 2
  i32.shl
  i32.add
  local.get $1
  i32.store $0 offset=96
  local.get $0
  local.get $0
  i32.load $0
  i32.const 1
  local.get $5
  i32.shl
  i32.or
  i32.store $0
  local.get $0
  local.get $5
  i32.const 2
  i32.shl
  i32.add
  local.tee $0
  local.get $0
  i32.load $0 offset=4
  i32.const 1
  local.get $2
  i32.shl
  i32.or
  i32.store $0 offset=4
 )
 (func $~lib/rt/tlsf/addMemory (param $0 i32) (param $1 i32) (param $2 i64)
  (local $3 i32)
  (local $4 i32)
  local.get $2
  local.get $1
  i64.extend_i32_u
  i64.lt_u
  if
   i32.const 0
   i32.const 8560
   i32.const 382
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.const 19
  i32.add
  i32.const -16
  i32.and
  i32.const 4
  i32.sub
  local.set $1
  local.get $0
  i32.load $0 offset=1568
  local.tee $4
  if
   local.get $4
   i32.const 4
   i32.add
   local.get $1
   i32.gt_u
   if
    i32.const 0
    i32.const 8560
    i32.const 389
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   local.get $1
   i32.const 16
   i32.sub
   local.get $4
   i32.eq
   if
    local.get $4
    i32.load $0
    local.set $3
    local.get $1
    i32.const 16
    i32.sub
    local.set $1
   end
  else
   local.get $0
   i32.const 1572
   i32.add
   local.get $1
   i32.gt_u
   if
    i32.const 0
    i32.const 8560
    i32.const 402
    i32.const 5
    call $~lib/builtins/abort
    unreachable
   end
  end
  local.get $2
  i32.wrap_i64
  i32.const -16
  i32.and
  local.get $1
  i32.sub
  local.tee $4
  i32.const 20
  i32.lt_u
  if
   return
  end
  local.get $1
  local.get $3
  i32.const 2
  i32.and
  local.get $4
  i32.const 8
  i32.sub
  local.tee $3
  i32.const 1
  i32.or
  i32.or
  i32.store $0
  local.get $1
  i32.const 0
  i32.store $0 offset=4
  local.get $1
  i32.const 0
  i32.store $0 offset=8
  local.get $1
  i32.const 4
  i32.add
  local.get $3
  i32.add
  local.tee $3
  i32.const 2
  i32.store $0
  local.get $0
  local.get $3
  i32.store $0 offset=1568
  local.get $0
  local.get $1
  call $~lib/rt/tlsf/insertBlock
 )
 (func $~lib/rt/tlsf/initialize
  (local $0 i32)
  (local $1 i32)
  memory.size $0
  local.tee $1
  i32.const 0
  i32.le_s
  if (result i32)
   i32.const 1
   local.get $1
   i32.sub
   memory.grow $0
   i32.const 0
   i32.lt_s
  else
   i32.const 0
  end
  if
   unreachable
  end
  i32.const 42304
  i32.const 0
  i32.store $0
  i32.const 43872
  i32.const 0
  i32.store $0
  loop $for-loop|0
   local.get $0
   i32.const 23
   i32.lt_u
   if
    local.get $0
    i32.const 2
    i32.shl
    i32.const 42304
    i32.add
    i32.const 0
    i32.store $0 offset=4
    i32.const 0
    local.set $1
    loop $for-loop|1
     local.get $1
     i32.const 16
     i32.lt_u
     if
      local.get $0
      i32.const 4
      i32.shl
      local.get $1
      i32.add
      i32.const 2
      i32.shl
      i32.const 42304
      i32.add
      i32.const 0
      i32.store $0 offset=96
      local.get $1
      i32.const 1
      i32.add
      local.set $1
      br $for-loop|1
     end
    end
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
  i32.const 42304
  i32.const 43876
  memory.size $0
  i64.extend_i32_s
  i64.const 16
  i64.shl
  call $~lib/rt/tlsf/addMemory
  i32.const 42304
  global.set $~lib/rt/tlsf/ROOT
 )
 (func $~lib/rt/itcms/step (result i32)
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  block $break|0
   block $case2|0
    block $case1|0
     block $case0|0
      global.get $~lib/rt/itcms/state
      br_table $case0|0 $case1|0 $case2|0 $break|0
     end
     i32.const 1
     global.set $~lib/rt/itcms/state
     i32.const 0
     global.set $~lib/rt/itcms/visitCount
     call $~lib/rt/itcms/visitRoots
     global.get $~lib/rt/itcms/toSpace
     global.set $~lib/rt/itcms/iter
     global.get $~lib/rt/itcms/visitCount
     return
    end
    global.get $~lib/rt/itcms/white
    i32.eqz
    local.set $1
    global.get $~lib/rt/itcms/iter
    i32.load $0 offset=4
    i32.const -4
    i32.and
    local.set $0
    loop $while-continue|1
     local.get $0
     global.get $~lib/rt/itcms/toSpace
     i32.ne
     if
      local.get $0
      global.set $~lib/rt/itcms/iter
      local.get $1
      local.get $0
      i32.load $0 offset=4
      i32.const 3
      i32.and
      i32.ne
      if
       local.get $0
       local.get $0
       i32.load $0 offset=4
       i32.const -4
       i32.and
       local.get $1
       i32.or
       i32.store $0 offset=4
       i32.const 0
       global.set $~lib/rt/itcms/visitCount
       local.get $0
       i32.const 20
       i32.add
       call $~lib/rt/__visit_members
       global.get $~lib/rt/itcms/visitCount
       return
      end
      local.get $0
      i32.load $0 offset=4
      i32.const -4
      i32.and
      local.set $0
      br $while-continue|1
     end
    end
    i32.const 0
    global.set $~lib/rt/itcms/visitCount
    call $~lib/rt/itcms/visitRoots
    global.get $~lib/rt/itcms/toSpace
    global.get $~lib/rt/itcms/iter
    i32.load $0 offset=4
    i32.const -4
    i32.and
    i32.eq
    if
     global.get $~lib/memory/__stack_pointer
     local.set $0
     loop $while-continue|0
      local.get $0
      i32.const 42292
      i32.lt_u
      if
       local.get $0
       i32.load $0
       local.tee $2
       if
        local.get $2
        call $byn-split-outlined-A$~lib/rt/itcms/__visit
       end
       local.get $0
       i32.const 4
       i32.add
       local.set $0
       br $while-continue|0
      end
     end
     global.get $~lib/rt/itcms/iter
     i32.load $0 offset=4
     i32.const -4
     i32.and
     local.set $0
     loop $while-continue|2
      local.get $0
      global.get $~lib/rt/itcms/toSpace
      i32.ne
      if
       local.get $1
       local.get $0
       i32.load $0 offset=4
       i32.const 3
       i32.and
       i32.ne
       if
        local.get $0
        local.get $0
        i32.load $0 offset=4
        i32.const -4
        i32.and
        local.get $1
        i32.or
        i32.store $0 offset=4
        local.get $0
        i32.const 20
        i32.add
        call $~lib/rt/__visit_members
       end
       local.get $0
       i32.load $0 offset=4
       i32.const -4
       i32.and
       local.set $0
       br $while-continue|2
      end
     end
     global.get $~lib/rt/itcms/fromSpace
     local.set $0
     global.get $~lib/rt/itcms/toSpace
     global.set $~lib/rt/itcms/fromSpace
     local.get $0
     global.set $~lib/rt/itcms/toSpace
     local.get $1
     global.set $~lib/rt/itcms/white
     local.get $0
     i32.load $0 offset=4
     i32.const -4
     i32.and
     global.set $~lib/rt/itcms/iter
     i32.const 2
     global.set $~lib/rt/itcms/state
    end
    global.get $~lib/rt/itcms/visitCount
    return
   end
   global.get $~lib/rt/itcms/iter
   local.tee $0
   global.get $~lib/rt/itcms/toSpace
   i32.ne
   if
    local.get $0
    i32.load $0 offset=4
    local.tee $1
    i32.const -4
    i32.and
    global.set $~lib/rt/itcms/iter
    global.get $~lib/rt/itcms/white
    i32.eqz
    local.get $1
    i32.const 3
    i32.and
    i32.ne
    if
     i32.const 0
     i32.const 8288
     i32.const 229
     i32.const 20
     call $~lib/builtins/abort
     unreachable
    end
    local.get $0
    i32.const 42292
    i32.lt_u
    if
     local.get $0
     i32.const 0
     i32.store $0 offset=4
     local.get $0
     i32.const 0
     i32.store $0 offset=8
    else
     global.get $~lib/rt/itcms/total
     local.get $0
     i32.load $0
     i32.const -4
     i32.and
     i32.const 4
     i32.add
     i32.sub
     global.set $~lib/rt/itcms/total
     local.get $0
     i32.const 4
     i32.add
     local.tee $0
     i32.const 42292
     i32.ge_u
     if
      global.get $~lib/rt/tlsf/ROOT
      i32.eqz
      if
       call $~lib/rt/tlsf/initialize
      end
      global.get $~lib/rt/tlsf/ROOT
      local.set $1
      local.get $0
      i32.const 4
      i32.sub
      local.set $2
      local.get $0
      i32.const 15
      i32.and
      i32.const 1
      local.get $0
      select
      if (result i32)
       i32.const 1
      else
       local.get $2
       i32.load $0
       i32.const 1
       i32.and
      end
      if
       i32.const 0
       i32.const 8560
       i32.const 562
       i32.const 3
       call $~lib/builtins/abort
       unreachable
      end
      local.get $2
      local.get $2
      i32.load $0
      i32.const 1
      i32.or
      i32.store $0
      local.get $1
      local.get $2
      call $~lib/rt/tlsf/insertBlock
     end
    end
    i32.const 10
    return
   end
   global.get $~lib/rt/itcms/toSpace
   local.tee $0
   local.get $0
   i32.store $0 offset=4
   local.get $0
   local.get $0
   i32.store $0 offset=8
   i32.const 0
   global.set $~lib/rt/itcms/state
  end
  i32.const 0
 )
 (func $~lib/rt/tlsf/searchBlock (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $1
  i32.const 256
  i32.lt_u
  if (result i32)
   local.get $1
   i32.const 4
   i32.shr_u
  else
   i32.const 31
   local.get $1
   i32.const 1
   i32.const 27
   local.get $1
   i32.clz
   i32.sub
   i32.shl
   i32.add
   i32.const 1
   i32.sub
   local.get $1
   local.get $1
   i32.const 536870910
   i32.lt_u
   select
   local.tee $1
   i32.clz
   i32.sub
   local.tee $3
   i32.const 7
   i32.sub
   local.set $2
   local.get $1
   local.get $3
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
  end
  local.tee $1
  i32.const 16
  i32.lt_u
  local.get $2
  i32.const 23
  i32.lt_u
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 8560
   i32.const 334
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $2
  i32.const 2
  i32.shl
  i32.add
  i32.load $0 offset=4
  i32.const -1
  local.get $1
  i32.shl
  i32.and
  local.tee $1
  if (result i32)
   local.get $0
   local.get $1
   i32.ctz
   local.get $2
   i32.const 4
   i32.shl
   i32.add
   i32.const 2
   i32.shl
   i32.add
   i32.load $0 offset=96
  else
   local.get $0
   i32.load $0
   i32.const -1
   local.get $2
   i32.const 1
   i32.add
   i32.shl
   i32.and
   local.tee $1
   if (result i32)
    local.get $0
    local.get $1
    i32.ctz
    local.tee $1
    i32.const 2
    i32.shl
    i32.add
    i32.load $0 offset=4
    local.tee $2
    i32.eqz
    if
     i32.const 0
     i32.const 8560
     i32.const 347
     i32.const 18
     call $~lib/builtins/abort
     unreachable
    end
    local.get $0
    local.get $2
    i32.ctz
    local.get $1
    i32.const 4
    i32.shl
    i32.add
    i32.const 2
    i32.shl
    i32.add
    i32.load $0 offset=96
   else
    i32.const 0
   end
  end
 )
 (func $~lib/rt/itcms/__new (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $0
  i32.const 1073741804
  i32.ge_u
  if
   i32.const 8224
   i32.const 8288
   i32.const 261
   i32.const 31
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/rt/itcms/total
  global.get $~lib/rt/itcms/threshold
  i32.ge_u
  if
   block $__inlined_func$~lib/rt/itcms/interrupt
    i32.const 2048
    local.set $2
    loop $do-loop|0
     local.get $2
     call $~lib/rt/itcms/step
     i32.sub
     local.set $2
     global.get $~lib/rt/itcms/state
     i32.eqz
     if
      global.get $~lib/rt/itcms/total
      i64.extend_i32_u
      i64.const 200
      i64.mul
      i64.const 100
      i64.div_u
      i32.wrap_i64
      i32.const 1024
      i32.add
      global.set $~lib/rt/itcms/threshold
      br $__inlined_func$~lib/rt/itcms/interrupt
     end
     local.get $2
     i32.const 0
     i32.gt_s
     br_if $do-loop|0
    end
    global.get $~lib/rt/itcms/total
    local.tee $2
    local.get $2
    global.get $~lib/rt/itcms/threshold
    i32.sub
    i32.const 1024
    i32.lt_u
    i32.const 10
    i32.shl
    i32.add
    global.set $~lib/rt/itcms/threshold
   end
  end
  global.get $~lib/rt/tlsf/ROOT
  i32.eqz
  if
   call $~lib/rt/tlsf/initialize
  end
  global.get $~lib/rt/tlsf/ROOT
  local.set $4
  local.get $0
  i32.const 16
  i32.add
  local.tee $2
  i32.const 1073741820
  i32.gt_u
  if
   i32.const 8224
   i32.const 8560
   i32.const 461
   i32.const 29
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  i32.const 12
  local.get $2
  i32.const 19
  i32.add
  i32.const -16
  i32.and
  i32.const 4
  i32.sub
  local.get $2
  i32.const 12
  i32.le_u
  select
  local.tee $5
  call $~lib/rt/tlsf/searchBlock
  local.tee $2
  i32.eqz
  if
   memory.size $0
   local.tee $2
   local.get $5
   i32.const 256
   i32.ge_u
   if (result i32)
    local.get $5
    i32.const 1
    i32.const 27
    local.get $5
    i32.clz
    i32.sub
    i32.shl
    i32.add
    i32.const 1
    i32.sub
    local.get $5
    local.get $5
    i32.const 536870910
    i32.lt_u
    select
   else
    local.get $5
   end
   i32.const 4
   local.get $4
   i32.load $0 offset=1568
   local.get $2
   i32.const 16
   i32.shl
   i32.const 4
   i32.sub
   i32.ne
   i32.shl
   i32.add
   i32.const 65535
   i32.add
   i32.const -65536
   i32.and
   i32.const 16
   i32.shr_u
   local.tee $3
   local.get $2
   local.get $3
   i32.gt_s
   select
   memory.grow $0
   i32.const 0
   i32.lt_s
   if
    local.get $3
    memory.grow $0
    i32.const 0
    i32.lt_s
    if
     unreachable
    end
   end
   local.get $4
   local.get $2
   i32.const 16
   i32.shl
   memory.size $0
   i64.extend_i32_s
   i64.const 16
   i64.shl
   call $~lib/rt/tlsf/addMemory
   local.get $4
   local.get $5
   call $~lib/rt/tlsf/searchBlock
   local.tee $2
   i32.eqz
   if
    i32.const 0
    i32.const 8560
    i32.const 499
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
  end
  local.get $5
  local.get $2
  i32.load $0
  i32.const -4
  i32.and
  i32.gt_u
  if
   i32.const 0
   i32.const 8560
   i32.const 501
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  local.get $2
  call $~lib/rt/tlsf/removeBlock
  local.get $2
  i32.load $0
  local.set $3
  local.get $5
  i32.const 4
  i32.add
  i32.const 15
  i32.and
  if
   i32.const 0
   i32.const 8560
   i32.const 361
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $3
  i32.const -4
  i32.and
  local.get $5
  i32.sub
  local.tee $6
  i32.const 16
  i32.ge_u
  if
   local.get $2
   local.get $5
   local.get $3
   i32.const 2
   i32.and
   i32.or
   i32.store $0
   local.get $2
   i32.const 4
   i32.add
   local.get $5
   i32.add
   local.tee $3
   local.get $6
   i32.const 4
   i32.sub
   i32.const 1
   i32.or
   i32.store $0
   local.get $4
   local.get $3
   call $~lib/rt/tlsf/insertBlock
  else
   local.get $2
   local.get $3
   i32.const -2
   i32.and
   i32.store $0
   local.get $2
   i32.const 4
   i32.add
   local.get $2
   i32.load $0
   i32.const -4
   i32.and
   i32.add
   local.tee $3
   local.get $3
   i32.load $0
   i32.const -3
   i32.and
   i32.store $0
  end
  local.get $2
  local.get $1
  i32.store $0 offset=12
  local.get $2
  local.get $0
  i32.store $0 offset=16
  global.get $~lib/rt/itcms/fromSpace
  local.tee $1
  i32.load $0 offset=8
  local.set $3
  local.get $2
  local.get $1
  global.get $~lib/rt/itcms/white
  i32.or
  i32.store $0 offset=4
  local.get $2
  local.get $3
  i32.store $0 offset=8
  local.get $3
  local.get $2
  local.get $3
  i32.load $0 offset=4
  i32.const 3
  i32.and
  i32.or
  i32.store $0 offset=4
  local.get $1
  local.get $2
  i32.store $0 offset=8
  global.get $~lib/rt/itcms/total
  local.get $2
  i32.load $0
  i32.const -4
  i32.and
  i32.const 4
  i32.add
  i32.add
  global.set $~lib/rt/itcms/total
  local.get $2
  i32.const 20
  i32.add
  local.tee $1
  i32.const 0
  local.get $0
  memory.fill $0
  local.get $1
 )
 (func $start:src/assembly/src/crypto/SHA256
  (local $0 i32)
  (local $1 i32)
  memory.size $0
  i32.const 16
  i32.shl
  i32.const 42292
  i32.sub
  i32.const 1
  i32.shr_u
  global.set $~lib/rt/itcms/threshold
  i32.const 8340
  i32.const 8336
  i32.store $0
  i32.const 8344
  i32.const 8336
  i32.store $0
  i32.const 8336
  global.set $~lib/rt/itcms/pinSpace
  i32.const 8372
  i32.const 8368
  i32.store $0
  i32.const 8376
  i32.const 8368
  i32.store $0
  i32.const 8368
  global.set $~lib/rt/itcms/toSpace
  i32.const 8516
  i32.const 8512
  i32.store $0
  i32.const 8520
  i32.const 8512
  i32.store $0
  i32.const 8512
  global.set $~lib/rt/itcms/fromSpace
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 9524
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   local.tee $0
   i64.const 0
   i64.store $0
   local.get $0
   i32.const 0
   i32.store $0 offset=8
   local.get $0
   i32.const 64
   i32.const 4
   call $~lib/rt/itcms/__new
   local.tee $0
   i32.store $0
   global.get $~lib/memory/__stack_pointer
   local.tee $1
   local.get $0
   i32.store $0 offset=4
   local.get $1
   i32.const 4
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 9524
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.store $0
   local.get $0
   i32.eqz
   if
    global.get $~lib/memory/__stack_pointer
    i32.const 0
    i32.const 0
    call $~lib/rt/itcms/__new
    local.tee $0
    i32.store $0
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $1
   local.get $0
   i32.store $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store $0 offset=4
   i32.const 64
   i32.const 8624
   call $~lib/rt/__newArray
   local.set $1
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store $0 offset=8
   local.get $0
   local.get $1
   i32.store $0
   local.get $1
   if
    local.get $0
    local.get $1
    call $byn-split-outlined-A$~lib/rt/itcms/__link
   end
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store $0 offset=4
   i32.const 8
   i32.const 8912
   call $~lib/rt/__newArray
   local.set $1
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store $0 offset=8
   local.get $0
   local.get $1
   i32.store $0 offset=4
   local.get $1
   if
    local.get $0
    local.get $1
    call $byn-split-outlined-A$~lib/rt/itcms/__link
   end
   global.get $~lib/memory/__stack_pointer
   local.tee $1
   local.get $0
   i32.store $0 offset=4
   local.get $0
   i64.const 0
   i64.store $0 offset=8
   local.get $1
   local.get $0
   i32.store $0 offset=4
   local.get $0
   i64.const 0
   i64.store $0 offset=16
   local.get $1
   local.get $0
   i32.store $0 offset=4
   local.get $0
   i64.const 0
   i64.store $0 offset=24
   local.get $1
   local.get $0
   i32.store $0 offset=4
   local.get $0
   i64.const 0
   i64.store $0 offset=32
   local.get $1
   local.get $0
   i32.store $0 offset=4
   local.get $0
   i32.const 0
   i32.store $0 offset=40
   local.get $1
   local.get $0
   i32.store $0 offset=4
   local.get $0
   i32.const 0
   i32.store $0 offset=44
   local.get $1
   local.get $0
   i32.store $0 offset=4
   local.get $0
   i32.const 0
   i32.store8 $0 offset=48
   local.get $1
   local.get $0
   i32.store $0 offset=4
   i32.const 64
   call $~lib/typedarray/Uint32Array#constructor
   local.set $1
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store $0 offset=8
   local.get $0
   local.get $1
   i32.store $0 offset=52
   local.get $1
   if
    local.get $0
    local.get $1
    call $byn-split-outlined-A$~lib/rt/itcms/__link
   end
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store $0 offset=4
   i32.const 8
   call $~lib/typedarray/Uint32Array#constructor
   local.set $1
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store $0 offset=8
   local.get $0
   local.get $1
   i32.store $0 offset=56
   local.get $1
   if
    local.get $0
    local.get $1
    call $byn-split-outlined-A$~lib/rt/itcms/__link
   end
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store $0 offset=4
   i32.const 8
   call $~lib/typedarray/Uint32Array#constructor
   local.set $1
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store $0 offset=8
   local.get $0
   local.get $1
   i32.store $0 offset=60
   local.get $1
   if
    local.get $0
    local.get $1
    call $byn-split-outlined-A$~lib/rt/itcms/__link
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $0
   global.set $src/assembly/src/crypto/SHA256/instance
   return
  end
  i32.const 42320
  i32.const 42368
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $~lib/rt/itcms/__pin (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  if
   local.get $0
   i32.const 20
   i32.sub
   local.tee $1
   i32.load $0 offset=4
   i32.const 3
   i32.and
   i32.const 3
   i32.eq
   if
    i32.const 9376
    i32.const 8288
    i32.const 338
    i32.const 7
    call $~lib/builtins/abort
    unreachable
   end
   local.get $1
   call $~lib/rt/itcms/Object#unlink
   global.get $~lib/rt/itcms/pinSpace
   local.tee $3
   i32.load $0 offset=8
   local.set $2
   local.get $1
   local.get $3
   i32.const 3
   i32.or
   i32.store $0 offset=4
   local.get $1
   local.get $2
   i32.store $0 offset=8
   local.get $2
   local.get $1
   local.get $2
   i32.load $0 offset=4
   i32.const 3
   i32.and
   i32.or
   i32.store $0 offset=4
   local.get $3
   local.get $1
   i32.store $0 offset=8
  end
  local.get $0
 )
 (func $~lib/rt/itcms/__unpin (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  local.get $0
  i32.eqz
  if
   return
  end
  local.get $0
  i32.const 20
  i32.sub
  local.tee $1
  i32.load $0 offset=4
  i32.const 3
  i32.and
  i32.const 3
  i32.ne
  if
   i32.const 9440
   i32.const 8288
   i32.const 352
   i32.const 5
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/rt/itcms/state
  i32.const 1
  i32.eq
  if
   local.get $1
   call $~lib/rt/itcms/Object#makeGray
  else
   local.get $1
   call $~lib/rt/itcms/Object#unlink
   global.get $~lib/rt/itcms/fromSpace
   local.tee $0
   i32.load $0 offset=8
   local.set $2
   local.get $1
   local.get $0
   global.get $~lib/rt/itcms/white
   i32.or
   i32.store $0 offset=4
   local.get $1
   local.get $2
   i32.store $0 offset=8
   local.get $2
   local.get $1
   local.get $2
   i32.load $0 offset=4
   i32.const 3
   i32.and
   i32.or
   i32.store $0 offset=4
   local.get $0
   local.get $1
   i32.store $0 offset=8
  end
 )
 (func $~lib/rt/itcms/__collect
  global.get $~lib/rt/itcms/state
  i32.const 0
  i32.gt_s
  if
   loop $while-continue|0
    global.get $~lib/rt/itcms/state
    if
     call $~lib/rt/itcms/step
     drop
     br $while-continue|0
    end
   end
  end
  call $~lib/rt/itcms/step
  drop
  loop $while-continue|1
   global.get $~lib/rt/itcms/state
   if
    call $~lib/rt/itcms/step
    drop
    br $while-continue|1
   end
  end
  global.get $~lib/rt/itcms/total
  i64.extend_i32_u
  i64.const 200
  i64.mul
  i64.const 100
  i64.div_u
  i32.wrap_i64
  i32.const 1024
  i32.add
  global.set $~lib/rt/itcms/threshold
 )
 (func $~lib/array/Array<u32>~visit (param $0 i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 9524
  i32.lt_s
  if
   i32.const 42320
   i32.const 42368
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $1
  i32.const 0
  i32.store $0
  local.get $1
  local.get $0
  i32.store $0
  local.get $0
  i32.load $0
  local.tee $0
  if
   local.get $0
   call $byn-split-outlined-A$~lib/rt/itcms/__visit
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/rt/__visit_members (param $0 i32)
  (local $1 i32)
  block $folding-inner0
   block $invalid
    block $~lib/array/Array<i32>
     block $~lib/array/Array<u32>
      block $src/assembly/src/crypto/SHA256/SHA256_ENGINE
       block $~lib/string/String
        block $~lib/arraybuffer/ArrayBuffer
         block $~lib/object/Object
          local.get $0
          i32.const 8
          i32.sub
          i32.load $0
          br_table $~lib/object/Object $~lib/arraybuffer/ArrayBuffer $~lib/string/String $folding-inner0 $src/assembly/src/crypto/SHA256/SHA256_ENGINE $~lib/array/Array<u32> $folding-inner0 $~lib/array/Array<i32> $invalid
         end
         return
        end
        return
       end
       return
      end
      local.get $0
      i32.load $0
      local.tee $1
      if
       local.get $1
       call $byn-split-outlined-A$~lib/rt/itcms/__visit
      end
      local.get $0
      i32.load $0 offset=4
      local.tee $1
      if
       local.get $1
       call $byn-split-outlined-A$~lib/rt/itcms/__visit
      end
      local.get $0
      i32.load $0 offset=52
      local.tee $1
      if
       local.get $1
       call $byn-split-outlined-A$~lib/rt/itcms/__visit
      end
      local.get $0
      i32.load $0 offset=56
      local.tee $1
      if
       local.get $1
       call $byn-split-outlined-A$~lib/rt/itcms/__visit
      end
      local.get $0
      i32.load $0 offset=60
      local.tee $0
      if
       local.get $0
       call $byn-split-outlined-A$~lib/rt/itcms/__visit
      end
      return
     end
     local.get $0
     call $~lib/array/Array<u32>~visit
     return
    end
    local.get $0
    call $~lib/array/Array<u32>~visit
    return
   end
   unreachable
  end
  local.get $0
  i32.load $0
  local.tee $0
  if
   local.get $0
   call $byn-split-outlined-A$~lib/rt/itcms/__visit
  end
 )
 (func $~start
  call $start:src/assembly/src/crypto/SHA256
 )
 (func $~lib/typedarray/Uint32Array#constructor (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 9524
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   local.tee $1
   i64.const 0
   i64.store $0
   local.get $1
   i32.const 12
   i32.const 6
   call $~lib/rt/itcms/__new
   local.tee $1
   i32.store $0
   global.get $~lib/memory/__stack_pointer
   local.tee $2
   local.get $1
   i32.store $0 offset=4
   local.get $2
   i32.const 16
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 9524
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   local.tee $3
   i64.const 0
   i64.store $0
   local.get $3
   i64.const 0
   i64.store $0 offset=8
   local.get $1
   i32.eqz
   if
    global.get $~lib/memory/__stack_pointer
    i32.const 12
    i32.const 3
    call $~lib/rt/itcms/__new
    local.tee $1
    i32.store $0
   end
   global.get $~lib/memory/__stack_pointer
   local.tee $3
   local.get $1
   i32.store $0 offset=4
   local.get $1
   i32.const 0
   i32.store $0
   local.get $3
   local.get $1
   i32.store $0 offset=4
   local.get $1
   i32.const 0
   i32.store $0 offset=4
   local.get $3
   local.get $1
   i32.store $0 offset=4
   local.get $1
   i32.const 0
   i32.store $0 offset=8
   local.get $0
   i32.const 268435455
   i32.gt_u
   if
    i32.const 8976
    i32.const 9024
    i32.const 19
    i32.const 57
    call $~lib/builtins/abort
    unreachable
   end
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.const 2
   i32.shl
   local.tee $3
   i32.const 1
   call $~lib/rt/itcms/__new
   local.tee $0
   i32.store $0 offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store $0 offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store $0 offset=12
   local.get $1
   local.get $0
   i32.store $0
   local.get $0
   if
    local.get $1
    local.get $0
    call $byn-split-outlined-A$~lib/rt/itcms/__link
   end
   global.get $~lib/memory/__stack_pointer
   local.tee $4
   local.get $1
   i32.store $0 offset=4
   local.get $1
   local.get $0
   i32.store $0 offset=4
   local.get $4
   local.get $1
   i32.store $0 offset=4
   local.get $1
   local.get $3
   i32.store $0 offset=8
   local.get $4
   i32.const 16
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $2
   local.get $1
   i32.store $0
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $1
   return
  end
  i32.const 42320
  i32.const 42368
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $~lib/typedarray/Uint32Array#get:length (param $0 i32) (result i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 9524
  i32.lt_s
  if
   i32.const 42320
   i32.const 42368
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $1
  i32.const 0
  i32.store $0
  local.get $1
  local.get $0
  i32.store $0
  local.get $0
  i32.load $0 offset=8
  i32.const 2
  i32.shr_u
  local.set $0
  local.get $1
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $~lib/typedarray/Uint32Array#__set (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 9524
  i32.lt_s
  if
   i32.const 42320
   i32.const 42368
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $3
  i32.const 0
  i32.store $0
  local.get $3
  local.get $0
  i32.store $0
  local.get $1
  local.get $0
  i32.load $0 offset=8
  i32.const 2
  i32.shr_u
  i32.ge_u
  if
   i32.const 8416
   i32.const 9264
   i32.const 889
   i32.const 64
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $3
  local.get $0
  i32.store $0
  local.get $0
  i32.load $0 offset=4
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  local.get $2
  i32.store $0
  local.get $3
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/typedarray/Uint32Array#__get (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 9524
  i32.lt_s
  if
   i32.const 42320
   i32.const 42368
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $2
  i32.const 0
  i32.store $0
  local.get $2
  local.get $0
  i32.store $0
  local.get $1
  local.get $0
  i32.load $0 offset=8
  i32.const 2
  i32.shr_u
  i32.ge_u
  if
   i32.const 8416
   i32.const 9264
   i32.const 878
   i32.const 64
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $2
  local.get $0
  i32.store $0
  local.get $0
  i32.load $0 offset=4
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  i32.load $0
  local.set $0
  local.get $2
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $src/assembly/src/crypto/SHA256/SHA256_ENGINE#hashChunk (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 16
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner1
   global.get $~lib/memory/__stack_pointer
   i32.const 9524
   i32.lt_s
   br_if $folding-inner1
   global.get $~lib/memory/__stack_pointer
   local.tee $1
   i64.const 0
   i64.store $0
   local.get $1
   i64.const 0
   i64.store $0 offset=8
   local.get $1
   local.get $0
   i32.store $0 offset=8
   local.get $1
   local.get $0
   i32.load $0 offset=60
   local.tee $2
   i32.store $0
   local.get $1
   local.get $0
   i32.store $0 offset=8
   local.get $1
   local.get $0
   i32.load $0 offset=56
   local.tee $4
   i32.store $0 offset=4
   local.get $1
   i32.const 12
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 9524
   i32.lt_s
   br_if $folding-inner1
   global.get $~lib/memory/__stack_pointer
   local.tee $1
   i64.const 0
   i64.store $0
   local.get $1
   i32.const 0
   i32.store $0 offset=8
   local.get $1
   local.get $2
   i32.store $0
   local.get $1
   local.get $4
   i32.store $0 offset=4
   local.get $1
   local.get $4
   i32.store $0 offset=8
   local.get $4
   call $~lib/typedarray/Uint32Array#get:length
   local.set $1
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store $0 offset=8
   local.get $2
   call $~lib/typedarray/Uint32Array#get:length
   local.get $1
   i32.lt_s
   if
    i32.const 8416
    i32.const 9264
    i32.const 1902
    i32.const 5
    call $~lib/builtins/abort
    unreachable
   end
   global.get $~lib/memory/__stack_pointer
   local.tee $5
   local.get $2
   i32.store $0 offset=8
   local.get $2
   i32.load $0 offset=4
   local.set $2
   local.get $5
   local.get $4
   i32.store $0 offset=8
   local.get $2
   local.get $4
   i32.load $0 offset=4
   local.get $1
   i32.const 2
   i32.shl
   memory.copy $0 $0
   local.get $5
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   loop $for-loop|0
    local.get $3
    i32.const 64
    i32.lt_s
    if
     local.get $3
     i32.const 16
     i32.lt_s
     if
      global.get $~lib/memory/__stack_pointer
      local.tee $1
      local.get $0
      i32.store $0 offset=4
      local.get $1
      local.get $0
      i32.load $0 offset=52
      local.tee $4
      i32.store $0
      local.get $1
      local.get $0
      i32.store $0 offset=4
      local.get $1
      local.get $0
      i32.store $0 offset=8
      local.get $0
      i32.load $0 offset=40
      i32.const 4
      i32.shl
      local.get $3
      i32.add
      local.set $5
      i32.const 0
      local.set $2
      local.get $1
      i32.const 4
      i32.sub
      global.set $~lib/memory/__stack_pointer
      global.get $~lib/memory/__stack_pointer
      i32.const 9524
      i32.lt_s
      br_if $folding-inner1
      global.get $~lib/memory/__stack_pointer
      local.tee $1
      i32.const 0
      i32.store $0
      local.get $1
      local.get $0
      i32.store $0
      local.get $5
      local.get $0
      i32.load $0 offset=44
      i32.lt_u
      if
       global.get $~lib/memory/__stack_pointer
       local.tee $1
       local.get $0
       i32.store $0
       local.get $0
       i64.load $0 offset=8
       i32.wrap_i64
       local.get $5
       i32.const 2
       i32.shl
       i32.add
       i32.load $0
       local.set $2
       local.get $1
       i32.const 4
       i32.add
       global.set $~lib/memory/__stack_pointer
       local.get $2
       i32.const -16711936
       i32.and
       i32.const 8
       i32.rotl
       local.get $2
       i32.const 16711935
       i32.and
       i32.const 8
       i32.rotr
       i32.or
       local.set $1
      else
       block $__inlined_func$src/assembly/src/crypto/SHA256/SHA256_ENGINE#readUint32BE
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        local.get $5
        local.get $0
        i32.load $0 offset=44
        i32.eq
        if
         global.get $~lib/memory/__stack_pointer
         local.get $0
         i32.store $0
         i32.const 128
         i32.const 24
         local.get $0
         i32.load8_u $0 offset=48
         i32.const 3
         i32.shl
         i32.const 255
         i32.and
         i32.sub
         i32.shl
         local.set $1
         loop $for-loop|00
          global.get $~lib/memory/__stack_pointer
          local.get $0
          i32.store $0
          local.get $2
          local.get $0
          i32.load8_u $0 offset=48
          i32.lt_u
          if
           global.get $~lib/memory/__stack_pointer
           local.get $0
           i32.store $0
           local.get $1
           local.get $2
           local.get $0
           i64.load $0 offset=8
           i32.wrap_i64
           i32.add
           i32.load8_u $0
           i32.const 24
           local.get $2
           i32.const 3
           i32.shl
           i32.const 255
           i32.and
           i32.sub
           i32.shl
           i32.or
           local.set $1
           local.get $2
           i32.const 1
           i32.add
           local.set $2
           br $for-loop|00
          end
         end
         global.get $~lib/memory/__stack_pointer
         i32.const 4
         i32.add
         global.set $~lib/memory/__stack_pointer
        else
         global.get $~lib/memory/__stack_pointer
         local.get $0
         i32.store $0
         local.get $5
         i32.const 2
         i32.shl
         i64.extend_i32_u
         local.get $0
         i64.load $0 offset=32
         i64.const 8
         i64.sub
         i64.lt_u
         if
          global.get $~lib/memory/__stack_pointer
          i32.const 4
          i32.add
          global.set $~lib/memory/__stack_pointer
          i32.const 0
          local.set $1
          br $__inlined_func$src/assembly/src/crypto/SHA256/SHA256_ENGINE#readUint32BE
         end
         global.get $~lib/memory/__stack_pointer
         local.get $0
         i32.store $0
         local.get $5
         i32.const 2
         i32.shl
         i64.extend_i32_u
         local.get $0
         i64.load $0 offset=32
         i64.const 8
         i64.sub
         i64.eq
         if
          global.get $~lib/memory/__stack_pointer
          local.tee $2
          local.get $0
          i32.store $0
          local.get $0
          i64.load $0 offset=16
          i64.const 3
          i64.shl
          i64.const 32
          i64.shr_u
          i32.wrap_i64
          local.set $1
          local.get $2
          i32.const 4
          i32.add
          global.set $~lib/memory/__stack_pointer
          br $__inlined_func$src/assembly/src/crypto/SHA256/SHA256_ENGINE#readUint32BE
         end
         global.get $~lib/memory/__stack_pointer
         local.tee $2
         local.get $0
         i32.store $0
         local.get $0
         i64.load $0 offset=16
         i64.const 3
         i64.shl
         i64.const 4294967295
         i64.and
         i32.wrap_i64
         local.set $1
         local.get $2
         i32.const 4
         i32.add
         global.set $~lib/memory/__stack_pointer
        end
       end
      end
      local.get $4
      local.get $3
      local.get $1
      call $~lib/typedarray/Uint32Array#__set
     else
      global.get $~lib/memory/__stack_pointer
      local.tee $1
      local.get $0
      i32.store $0 offset=4
      local.get $1
      local.get $0
      i32.load $0 offset=52
      local.tee $2
      i32.store $0
      local.get $1
      local.get $0
      i32.store $0 offset=4
      local.get $1
      local.get $0
      i32.store $0 offset=12
      local.get $1
      local.get $0
      i32.load $0 offset=52
      local.tee $1
      i32.store $0 offset=8
      local.get $1
      local.get $3
      i32.const 2
      i32.sub
      call $~lib/typedarray/Uint32Array#__get
      local.set $1
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store $0 offset=8
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.load $0 offset=52
      local.tee $4
      i32.store $0 offset=4
      local.get $4
      local.get $3
      i32.const 7
      i32.sub
      call $~lib/typedarray/Uint32Array#__get
      local.get $1
      i32.const 17
      i32.rotr
      local.get $1
      i32.const 19
      i32.rotr
      i32.xor
      local.get $1
      i32.const 10
      i32.shr_u
      i32.xor
      i32.add
      local.set $1
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store $0 offset=4
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store $0 offset=12
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.load $0 offset=52
      local.tee $4
      i32.store $0 offset=8
      local.get $4
      local.get $3
      i32.const 15
      i32.sub
      call $~lib/typedarray/Uint32Array#__get
      local.set $4
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store $0 offset=8
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.load $0 offset=52
      local.tee $5
      i32.store $0 offset=4
      local.get $2
      local.get $3
      local.get $5
      local.get $3
      i32.const 16
      i32.sub
      call $~lib/typedarray/Uint32Array#__get
      local.get $1
      local.get $4
      i32.const 7
      i32.rotr
      local.get $4
      i32.const 18
      i32.rotr
      i32.xor
      local.get $4
      i32.const 3
      i32.shr_u
      i32.xor
      i32.add
      i32.add
      call $~lib/typedarray/Uint32Array#__set
     end
     global.get $~lib/memory/__stack_pointer
     local.tee $1
     local.get $0
     i32.store $0 offset=4
     local.get $1
     local.get $0
     i32.load $0 offset=60
     local.tee $1
     i32.store $0
     local.get $1
     i32.const 7
     call $~lib/typedarray/Uint32Array#__get
     local.set $1
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $2
     i32.store $0 offset=4
     local.get $2
     i32.const 4
     call $~lib/typedarray/Uint32Array#__get
     local.set $2
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $4
     i32.store $0 offset=4
     local.get $4
     i32.const 4
     call $~lib/typedarray/Uint32Array#__get
     local.set $4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $5
     i32.store $0 offset=4
     local.get $5
     i32.const 5
     call $~lib/typedarray/Uint32Array#__get
     local.get $4
     i32.and
     local.set $5
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $6
     i32.store $0 offset=4
     local.get $1
     local.get $2
     i32.const 6
     i32.rotr
     local.get $2
     i32.const 11
     i32.rotr
     i32.xor
     local.get $2
     i32.const 25
     i32.rotr
     i32.xor
     i32.add
     local.get $5
     local.get $6
     i32.const 6
     call $~lib/typedarray/Uint32Array#__get
     local.get $4
     i32.const -1
     i32.xor
     i32.and
     i32.xor
     i32.add
     local.set $1
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0
     local.tee $2
     i32.store $0
     global.get $~lib/memory/__stack_pointer
     i32.const 4
     i32.sub
     global.set $~lib/memory/__stack_pointer
     global.get $~lib/memory/__stack_pointer
     i32.const 9524
     i32.lt_s
     br_if $folding-inner1
     global.get $~lib/memory/__stack_pointer
     local.tee $4
     i32.const 0
     i32.store $0
     local.get $4
     local.get $2
     i32.store $0
     local.get $3
     local.get $2
     i32.load $0 offset=12
     i32.ge_u
     if
      i32.const 8416
      i32.const 9328
      i32.const 114
      i32.const 42
      call $~lib/builtins/abort
      unreachable
     end
     global.get $~lib/memory/__stack_pointer
     local.tee $4
     local.get $2
     i32.store $0
     local.get $2
     i32.load $0 offset=4
     local.get $3
     i32.const 2
     i32.shl
     i32.add
     i32.load $0
     local.set $2
     local.get $4
     i32.const 4
     i32.add
     global.set $~lib/memory/__stack_pointer
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=52
     local.tee $4
     i32.store $0
     local.get $4
     local.get $3
     call $~lib/typedarray/Uint32Array#__get
     local.get $1
     local.get $2
     i32.add
     i32.add
     local.set $1
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $2
     i32.store $0 offset=4
     local.get $2
     i32.const 0
     call $~lib/typedarray/Uint32Array#__get
     local.set $2
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $4
     i32.store $0 offset=4
     local.get $4
     i32.const 0
     call $~lib/typedarray/Uint32Array#__get
     local.set $4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $5
     i32.store $0 offset=4
     local.get $5
     i32.const 1
     call $~lib/typedarray/Uint32Array#__get
     local.set $5
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $6
     i32.store $0 offset=4
     local.get $6
     i32.const 2
     call $~lib/typedarray/Uint32Array#__get
     local.set $6
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $7
     i32.store $0
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $8
     i32.store $0 offset=4
     local.get $7
     i32.const 7
     local.get $8
     i32.const 6
     call $~lib/typedarray/Uint32Array#__get
     call $~lib/typedarray/Uint32Array#__set
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $7
     i32.store $0
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $8
     i32.store $0 offset=4
     local.get $7
     i32.const 6
     local.get $8
     i32.const 5
     call $~lib/typedarray/Uint32Array#__get
     call $~lib/typedarray/Uint32Array#__set
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $7
     i32.store $0
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $8
     i32.store $0 offset=4
     local.get $7
     i32.const 5
     local.get $8
     i32.const 4
     call $~lib/typedarray/Uint32Array#__get
     call $~lib/typedarray/Uint32Array#__set
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $7
     i32.store $0
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $8
     i32.store $0 offset=4
     local.get $7
     i32.const 4
     local.get $8
     i32.const 3
     call $~lib/typedarray/Uint32Array#__get
     local.get $1
     i32.add
     call $~lib/typedarray/Uint32Array#__set
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $7
     i32.store $0
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $8
     i32.store $0 offset=4
     local.get $7
     i32.const 3
     local.get $8
     i32.const 2
     call $~lib/typedarray/Uint32Array#__get
     call $~lib/typedarray/Uint32Array#__set
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $7
     i32.store $0
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $8
     i32.store $0 offset=4
     local.get $7
     i32.const 2
     local.get $8
     i32.const 1
     call $~lib/typedarray/Uint32Array#__get
     call $~lib/typedarray/Uint32Array#__set
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $7
     i32.store $0
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $8
     i32.store $0 offset=4
     local.get $7
     i32.const 1
     local.get $8
     i32.const 0
     call $~lib/typedarray/Uint32Array#__get
     call $~lib/typedarray/Uint32Array#__set
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $7
     i32.store $0
     local.get $7
     i32.const 0
     local.get $1
     local.get $2
     i32.const 2
     i32.rotr
     local.get $2
     i32.const 13
     i32.rotr
     i32.xor
     local.get $2
     i32.const 22
     i32.rotr
     i32.xor
     local.get $5
     local.get $6
     i32.and
     local.get $4
     local.get $5
     i32.and
     local.get $4
     local.get $6
     i32.and
     i32.xor
     i32.xor
     i32.add
     i32.add
     call $~lib/typedarray/Uint32Array#__set
     local.get $3
     i32.const 1
     i32.add
     local.set $3
     br $for-loop|0
    end
   end
   i32.const 0
   local.set $3
   loop $for-loop|1
    local.get $3
    i32.const 8
    i32.lt_u
    if
     global.get $~lib/memory/__stack_pointer
     local.tee $1
     local.get $0
     i32.store $0 offset=4
     local.get $1
     local.get $0
     i32.load $0 offset=56
     local.tee $2
     i32.store $0
     local.get $1
     local.get $0
     i32.store $0 offset=8
     local.get $1
     local.get $0
     i32.load $0 offset=56
     local.tee $1
     i32.store $0 offset=4
     local.get $1
     local.get $3
     call $~lib/typedarray/Uint32Array#__get
     local.set $1
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load $0 offset=60
     local.tee $4
     i32.store $0 offset=4
     local.get $2
     local.get $3
     local.get $1
     i32.const 65535
     i32.and
     local.get $4
     local.get $3
     call $~lib/typedarray/Uint32Array#__get
     local.tee $2
     i32.const 65535
     i32.and
     i32.add
     local.tee $4
     i32.const 65535
     i32.and
     local.get $1
     i32.const 16
     i32.shr_u
     local.get $2
     i32.const 16
     i32.shr_u
     i32.add
     local.get $4
     i32.const 16
     i32.shr_u
     i32.add
     i32.const 16
     i32.shl
     i32.or
     call $~lib/typedarray/Uint32Array#__set
     local.get $3
     i32.const 1
     i32.add
     local.set $3
     br $for-loop|1
    end
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 16
   i32.add
   global.set $~lib/memory/__stack_pointer
   return
  end
  i32.const 42320
  i32.const 42368
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $src/assembly/src/crypto/SHA256/SHA256_ENGINE#execute (param $0 i32) (param $1 i64) (param $2 i64) (param $3 i64)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 9524
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   local.tee $6
   i64.const 0
   i64.store $0
   local.get $6
   i32.const 0
   i32.store $0 offset=8
   local.get $6
   local.get $0
   i32.store $0
   local.get $0
   local.get $1
   i64.store $0 offset=8
   local.get $6
   local.get $0
   i32.store $0
   local.get $0
   local.get $2
   i64.store $0 offset=16
   local.get $6
   local.get $0
   i32.store $0
   local.get $0
   local.get $3
   i64.store $0 offset=24
   local.get $6
   local.get $0
   i32.store $0
   local.get $6
   local.get $0
   i32.store $0 offset=4
   local.get $0
   local.get $0
   i64.load $0 offset=16
   f64.convert_i64_u
   f64.const 8
   f64.mul
   f64.const 1
   f64.add
   f64.const 64
   f64.add
   f64.const 0.001953125
   f64.mul
   f64.ceil
   i64.trunc_sat_f64_u
   i64.const 6
   i64.shl
   i64.store $0 offset=32
   local.get $6
   local.get $0
   i32.store $0
   local.get $6
   local.get $0
   i32.store $0 offset=4
   local.get $0
   local.get $0
   i64.load $0 offset=16
   f64.convert_i64_u
   f64.const 0.25
   f64.mul
   f64.floor
   i32.trunc_sat_f64_u
   i32.store $0 offset=44
   local.get $6
   local.get $0
   i32.store $0
   local.get $6
   local.get $0
   i32.store $0 offset=4
   local.get $0
   local.get $0
   i64.load $0 offset=16
   i64.const 3
   i64.and
   i64.store8 $0 offset=48
   local.get $6
   local.get $0
   i32.store $0 offset=8
   local.get $6
   local.get $0
   i32.load $0 offset=56
   local.tee $7
   i32.store $0
   local.get $6
   local.get $0
   i32.store $0 offset=8
   local.get $6
   local.get $0
   i32.load $0 offset=4
   local.tee $5
   i32.store $0 offset=4
   local.get $6
   i32.const 12
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 9524
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   local.tee $6
   i64.const 0
   i64.store $0
   local.get $6
   i32.const 0
   i32.store $0 offset=8
   local.get $6
   local.get $7
   i32.store $0
   local.get $6
   local.get $5
   i32.store $0 offset=4
   local.get $6
   local.get $5
   i32.store $0 offset=8
   local.get $6
   i32.const 4
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 9524
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   local.tee $8
   i32.const 0
   i32.store $0
   local.get $8
   local.get $5
   i32.store $0
   local.get $5
   i32.load $0 offset=12
   local.set $6
   local.get $8
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   local.get $7
   i32.store $0 offset=8
   local.get $7
   call $~lib/typedarray/Uint32Array#get:length
   local.get $6
   i32.lt_s
   if
    i32.const 8416
    i32.const 9264
    i32.const 1902
    i32.const 5
    call $~lib/builtins/abort
    unreachable
   end
   global.get $~lib/memory/__stack_pointer
   local.tee $8
   local.get $7
   i32.store $0 offset=8
   local.get $7
   i32.load $0 offset=4
   local.set $7
   local.get $8
   local.get $5
   i32.store $0 offset=8
   local.get $7
   local.get $5
   i32.load $0 offset=4
   local.get $6
   i32.const 2
   i32.shl
   memory.copy $0 $0
   local.get $8
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   loop $while-continue|0
    global.get $~lib/memory/__stack_pointer
    local.tee $5
    local.get $0
    i32.store $0
    local.get $0
    i32.load $0 offset=40
    i32.const 4
    i32.shl
    i64.extend_i32_u
    local.set $1
    local.get $5
    local.get $0
    i32.store $0
    local.get $1
    local.get $0
    i64.load $0 offset=32
    i64.const 2
    i64.shr_u
    i64.lt_u
    if
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0
     local.get $0
     call $src/assembly/src/crypto/SHA256/SHA256_ENGINE#hashChunk
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0 offset=4
     local.get $0
     local.get $0
     i32.load $0 offset=40
     i32.const 1
     i32.add
     i32.store $0 offset=40
     br $while-continue|0
    end
   end
   loop $for-loop|1
    local.get $4
    i32.const 8
    i32.lt_u
    if
     global.get $~lib/memory/__stack_pointer
     local.tee $5
     local.get $0
     i32.store $0
     local.get $0
     i64.load $0 offset=24
     i32.wrap_i64
     local.get $4
     i32.const 2
     i32.shl
     i32.add
     local.set $6
     local.get $5
     local.get $0
     i32.store $0 offset=4
     local.get $5
     local.get $0
     i32.load $0 offset=56
     local.tee $5
     i32.store $0
     local.get $6
     local.get $5
     local.get $4
     call $~lib/typedarray/Uint32Array#__get
     local.tee $5
     i32.const -16711936
     i32.and
     i32.const 8
     i32.rotl
     local.get $5
     i32.const 16711935
     i32.and
     i32.const 8
     i32.rotr
     i32.or
     i32.store $0
     local.get $4
     i32.const 1
     i32.add
     local.set $4
     br $for-loop|1
    end
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   return
  end
  i32.const 42320
  i32.const 42368
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $src/assembly/src/crypto/SHA256/execute (param $0 i64) (param $1 i64) (param $2 i64)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 9524
  i32.lt_s
  if
   i32.const 42320
   i32.const 42368
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store $0
  global.get $src/assembly/src/crypto/SHA256/instance
  i32.eqz
  if
   i32.const 9088
   i32.const 9168
   i32.const 220
   i32.const 20
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  global.get $src/assembly/src/crypto/SHA256/instance
  local.tee $3
  i32.store $0
  local.get $3
  local.get $0
  local.get $1
  local.get $2
  call $src/assembly/src/crypto/SHA256/SHA256_ENGINE#execute
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/rt/__newArray (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 9524
  i32.lt_s
  if
   i32.const 42320
   i32.const 42368
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $4
  i32.const 0
  i32.store $0
  local.get $0
  i32.const 2
  i32.shl
  local.tee $3
  i32.const 1
  call $~lib/rt/itcms/__new
  local.set $2
  local.get $1
  if
   local.get $2
   local.get $1
   local.get $3
   memory.copy $0 $0
  end
  local.get $4
  local.get $2
  i32.store $0
  i32.const 16
  i32.const 5
  call $~lib/rt/itcms/__new
  local.tee $1
  local.get $2
  i32.store $0
  local.get $2
  if
   local.get $1
   local.get $2
   call $byn-split-outlined-A$~lib/rt/itcms/__link
  end
  local.get $1
  local.get $2
  i32.store $0 offset=4
  local.get $1
  local.get $3
  i32.store $0 offset=8
  local.get $1
  local.get $0
  i32.store $0 offset=12
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $1
 )
 (func $byn-split-outlined-A$~lib/rt/itcms/__visit (param $0 i32)
  global.get $~lib/rt/itcms/white
  local.get $0
  i32.const 20
  i32.sub
  local.tee $0
  i32.load $0 offset=4
  i32.const 3
  i32.and
  i32.eq
  if
   local.get $0
   call $~lib/rt/itcms/Object#makeGray
   global.get $~lib/rt/itcms/visitCount
   i32.const 1
   i32.add
   global.set $~lib/rt/itcms/visitCount
  end
 )
 (func $byn-split-outlined-A$~lib/rt/itcms/__link (param $0 i32) (param $1 i32)
  local.get $0
  i32.eqz
  if
   i32.const 0
   i32.const 8288
   i32.const 295
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/rt/itcms/white
  local.get $1
  i32.const 20
  i32.sub
  local.tee $1
  i32.load $0 offset=4
  i32.const 3
  i32.and
  i32.eq
  if
   local.get $0
   i32.const 20
   i32.sub
   i32.load $0 offset=4
   i32.const 3
   i32.and
   local.tee $0
   global.get $~lib/rt/itcms/white
   i32.eqz
   i32.eq
   if
    local.get $1
    call $~lib/rt/itcms/Object#makeGray
   else
    global.get $~lib/rt/itcms/state
    i32.const 1
    i32.eq
    local.get $0
    i32.const 3
    i32.eq
    i32.and
    if
     local.get $1
     call $~lib/rt/itcms/Object#makeGray
    end
   end
  end
 )
)
