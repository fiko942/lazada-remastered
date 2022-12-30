import fs from 'fs'

export default async function DeleteCollections({onSuccess, onError, collections, global}) {
    var s = 0
    var f = 0

    var collection_list = JSON.parse(fs.readFileSync(
        global.files.collection_list,
        'utf-8'
    ))

    for(var collection of collections) {
        var i = collection_list.findIndex(x => x.created == collection.created)
        if(fs.existsSync(collection.path)) {
            try {
                fs.unlinkSync(collection.path)                

                // After delete collection success check on collection is exist or not
                if(i >= 0) collection_list.splice(i,1)
                s++
            } catch(err){f++; onError(err.message)}
        }
    }
    
    // Save modified collection list data
    fs.writeFileSync(global.files.collection_list, JSON.stringify(collection_list), 'utf-8')

    return onSuccess(`${s} collection berhasil dihapus${f > 0 ? ',' : '.'} ${f > 0 ? ` dan ${f} collection gagal dihapus` : ''}`)
}