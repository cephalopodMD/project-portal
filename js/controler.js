'use strict';

var active_pane = 'todo_pane',
    project_name_list = [],
    projects = {},
    selected_project = null;

const remote = nodeRequire('electron').remote,
      fs = remote.require('fs'),
      path = remote.require('path')

$(document).ready( function()
{
    project_name_list = localStorage.getItem('project_portal_list');
    if ( project_name_list === null ) 
    {
        project_name_list = []
        localStorage.setItem( 'project_portal_list', JSON.stringify([]) );
    }
    else 
    {
        try 
        {
            project_name_list = JSON.parse(project_name_list);
        }
        catch (e)
        {
            project_name_list = []
            localStorage.setItem( 'project_portal_list', JSON.stringify([]) );
        }
    }
    for ( var project_name of project_name_list ) 
    {
        var project = new Project(project_name);
        projects[project_name] = project;
        $('#project_list').append( projectHtml(project) )
    }
    if ( project_name_list.length > 0 )
        loadProject(project_name_list[0]);

    /**
     * Pane
     */
    $('.pane_frame')
    .on('mouseenter', function()
    {
        active_pane = $(this)[0].id;
        var fab = $('.fixed-action-btn');
        fab.css( 'margin-right', window.innerWidth - $(this)[0].getBoundingClientRect().right );
        if ( active_pane == 'project_pane' )
        {
            $('.btn-small').addClass('hide');
            fab.tooltip( {tooltip:'New Project', position:'left'} )
        }
        else if ( active_pane == 'file_pane' )
        {
            $('.btn-small').removeClass('hide');
            fab.tooltip('remove')
        }
        else if ( active_pane == 'todo_pane' )
        {
            $('.btn-small').addClass('hide');
            fab.tooltip( {tooltip:'New ToDo', position:'left'} )
        }
    })
    
    /**
     * Todo List
     */
    $('#todo_list')
    .on('click', '.todo', function()
    {
        var id = $(this).find('.todo_id').text(),
            status = $(this).find('.status'),
            todo_item = selected_project.todos[id];
        if ( todo_item.status == TodoItem.NEW ) 
        {
            todo_item.makeActive();
        }
        else if ( todo_item.status == TodoItem.ACTIVE ) 
        {
            todo_item.makeComplete();
        }
        else if ( todo_item.status == TodoItem.COMPLETE ) 
        {
            todo_item.makeNew();
        }
        $(this).replaceWith( todoItemHtml(todo_item) );
        selected_project.save()
    })
    .on('mouseenter', '.todo', function()
    {
        $(this).find('.edit').removeClass('scale-out');
    })
    .on('mouseleave', '.todo', function()
    {
        $(this).find('.edit').addClass('scale-out');
    })
    .on('click', '.edit', function(e)
    {
        e.stopPropagation();
        $('#todo_modal_id').val( $(this).parent().find('.todo_id').text() );
        $('#todo_modal_title').val( $(this).parent().find('.todo_title').text() );
        $('#todo_modal_description').val( $(this).parent().find('.todo_description').text() );
        $('#todo_modal').find('.delete').removeClass('hide');
        Materialize.updateTextFields();
        $('#todo_modal').modal('open');
    });

    /**
     * Project List
     */
    $('#project_list')
    .on('click', '.project', function()
    {
        var selected_project_title = $(this).find('.title').text();
        loadProject(selected_project_title)
    })
    .on('mouseenter', '.project', function()
    {
        $(this).find('.project_remove').removeClass('scale-out');
    })
    .on('mouseleave', '.project', function()
    {
        $(this).find('.project_remove').addClass('scale-out');
    })
    .on('click', '.project_remove', function(e)
    {
        e.stopPropagation();
        var title = $(this).parent().find('.title').text();
        $(this).parent().remove();
        projects[title].remove();
        delete projects[title];
        localStorage.setItem( 'project_portal_list', JSON.stringify( Object.keys(projects) ) );
    });

    /**
     * File List
     */
    $('#file_list')
    .on('click', '.file_item', function() 
    {
        var file_name = $(this).find('.full_name').text()
        remote.shell.openItem(file_name.replace(/\\/g, '/'))
    })
    .on('mouseenter', '.file_item', function()
    {
        $(this).find('.file_remove').removeClass('scale-out');
    })
    .on('mouseleave', '.file_item', function()
    {
        $(this).find('.file_remove').addClass('scale-out');
    })
    .on('click', '.file_remove', function(e)
    {
        e.stopPropagation();
        var file = $(this).parent().find('.full_name').text();
        selected_project.removeFile(file);
        $(this).parent().parent().remove();
    });

    /**
     * Asset Folder List
     */
    $('#asset_list')
    .on('click', '.asset_folder_item', function() 
    {
        var asset_folder = $(this).find('.full_name').text()
        remote.shell.openItem(asset_folder.replace(/\\/g, '/'))
    })
    .on('mouseenter', '.asset_folder_item', function()
    {
        $(this).find('.asset_folder_remove').removeClass('scale-out');
    })
    .on('mouseleave', '.asset_folder_item', function()
    {
        $(this).find('.asset_folder_remove').addClass('scale-out');
    })
    .on('click', '.asset_folder_remove', function(e)
    {
        e.stopPropagation();
        var folder = $(this).parent().find('.full_name').text();
        selected_project.removeFolder(folder);
        $(this).parent().parent().remove();
    });

    /**
     * Fixed Action Button
     */
    $('#fixed-action-btn')
    .on('click', function()
    {
        if ( active_pane == 'project_pane' )
        {
            $('#project_modal_title').val('');
            Materialize.updateTextFields();
            $('#project_modal').modal('open');
        }
        else if ( active_pane == 'todo_pane' )
        {
            $('#todo_modal_id').val(0);
            $('#todo_modal_title').val('');
            $('#todo_modal_description').val('');
            Materialize.updateTextFields();
            $('#todo_modal').modal('open');
        }
    })
    .on('click', '#add_file', function()
    {
        var files = selectFile();
        if( files == null )
            return;
        var file = files[0];
        if( selected_project.addFile(file) )
            $('#file_list').append( fileHtml(file) );
    })
    .on('click', '#add_asset_folder', function()
    {
        var asset_folders = selectDirectory();
        if( asset_folders == null )
            return;
        var asset_folder = asset_folders[0];
        if( selected_project.addFolder(asset_folder) )
            $('#asset_list').append( assetFolderHtml(asset_folder) );
    })

    /**
     * Modals
     */
    $('#todo_modal')
    .modal(
    {
        ready: function(modal, trigger) // Callback for Modal open. Modal and trigger parameters available.
        {},
        complete: function() // Callback for Modal close
        {
            $('#todo_modal').find('.delete').addClass('hide');
        }
    })
    .on('click', '.submit', function()
    {
        var id = $('#todo_modal_id').val(),
                title = $('#todo_modal_title').val(),
                description = $('#todo_modal_description').val(),
                new_todo_item = new TodoItem(id, title, description);
        if ( selected_project && selected_project.todos )
            selected_project.addTodo(new_todo_item);
        // TODO: simplify to appending todo html
        loadProject( selected_project.title );
        $('#todo_modal').modal('close');
    })
    .on('click', '.delete', function()
    {
        var id = $('#todo_modal_id').val();
        if( id != 0 )
            selected_project.removeTodoByID(id);
        loadProject( selected_project.title );
        $('#todo_modal').modal('close');
    });

    $('#project_modal')
    .modal(
    {
        ready: function(modal, trigger) // Callback for Modal open. Modal and trigger parameters available.
        {},
        complete: function() // Callback for Modal close
        {}
    })
    .on('click', '.folder_select', function()
    {
        $('#project_modal_root').val( selectDirectory()[0] );
    })
    .on('click', '.submit', function()
    {
        var title = $('#project_modal_title').val(),
                root_dir = $('#project_modal_root').val();
        if ( !projects.hasOwnProperty(title) )
        {
            var new_project = new Project(title);
            projects[title] = new_project;
            localStorage.setItem( 'project_portal_list', JSON.stringify( Object.keys(projects) ) );
            $('#project_list').append( projectHtml(new_project) );
        }
        if( root_dir.length > 0 )
        {
            $('#project_modal_progress').removeClass('hide');
            autoConfig( new_project, root_dir );
            $('#project_modal_progress').addClass('hide');
        }
        loadProject( title );
        $('#project_modal').modal('close');
    });

    /**
     * Collapsible Icon
     */
    $('.collapsible').collapsible(
    {
        accordion: false,
        onOpen: function(el)
        {
            $(el).find('#expand').addClass('scale-out');
            $(el).find('#contract').removeClass('scale-out');
        },
        onClose: function(el)
        {
            $(el).find('#expand').removeClass('scale-out');
            $(el).find('#contract').addClass('scale-out');
        }
    });
});

function loadProject(p_name)
{
    if ( selected_project !== null )
        selected_project.save();
    selected_project = projects[p_name];
    $('#selected_project_title').text(p_name)
    $('#todo_list').empty()
    for ( var t in selected_project.todos )
        $('#todo_list').append( todoItemHtml(selected_project.todos[t]) );
    $('#file_list').empty();
    for ( var f of selected_project.file_list )
        $('#file_list').append( fileHtml(f) );
    $('#asset_list').empty();
    for ( var f of selected_project.asset_folder_list )
        $('#asset_list').append( assetFolderHtml(f) );
}

function selectDirectory()
{
    return remote.dialog.showOpenDialog( {properties: ['openDirectory']} )
}

function selectFile()
{
    return remote.dialog.showOpenDialog( {properties: ['openFile']} )
}

const project_ext_list = [
    'aaf', 'aep', 'aepx', 'ai', 'aup',
    'cel', 'edl', 'imovieproj', 'fcp',
    'pbxproj', 'plb', 'prel', 'ppj',
    'prproj', 'psd', 'psq', 'ses',
    'vcxproj', 'veg', 'veg-bak', 'xcworkspace'
]
function autoConfig(project, root_dir)
{
    fs.readdirSync(root_dir).forEach((f, i, a) => {
        $('.determinate').width( Math.round((i / a.length)*100)+'%' )
        var f_path = path.join(root_dir, f);
        if( fs.statSync(f_path).isDirectory() )
        {
            // add directory if file count > 8 and 75% composed of up to 3 filetypes
            var dir_contents = fs.readdirSync(f_path);
            // check directory file count
            if( dir_contents.length < 8 )
                return;
            // check extensions distribution
            var c_ext = dir_contents.reduce( (e, f_reduce) => {
                var ext = f_reduce.split('.').pop();
                if( e.hasOwnProperty(ext) )
                    e[ext]++;
                else
                    e[ext] = 0;
                return e
            }, {});
            var sum_top_3 = Object.values(c_ext).sort().slice(0,3).reduce((a,b)=>a+=b);
            if( sum_top_3 >= dir_contents.length * 0.75 )
                project.addFolder(f_path);
        }
        else
        {
            if( project_ext_list.includes( f.split('.').pop() ) )
                project.addFile(f_path);
        }
    });
    project.save();
    loadProject( project.title );
    return;
}

const findR = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        if( fs.statSync(path.join(dir, file)).isDirectory() )
            filelist = findR(path.join(dir, file), filelist);
        else
            filelist = filelist.concat(path.join(dir, file));
    });
    return filelist;
}
