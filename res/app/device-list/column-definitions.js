var _ = require('lodash')

// Builders for all possible values
module.exports = function($filter, gettext) {
  return {
    state: DeviceStatusCell({
      title: gettext('Status')
    , value: function(device) {
        return $filter('translate')(device.enhancedStateAction)
      }
    })
  , model: DeviceModelCell({
      title: gettext('Model')
    , value: function(device) {
        return device.model || device.serial
      }
    })
  , name: TextCell({
      title: gettext('Product')
    , value: function(device) {
        return device.name || ''
      }
    })
  , operator: TextCell({
      title: gettext('Carrier')
    , value: function(device) {
        return device.operator || ''
      }
    })
  , releasedAt: DateCell({
      title: gettext('Released')
    , value: function(device) {
        return device.releasedAt ? new Date(device.releasedAt) : null
      }
    })
  , version: TextCell({
      title: gettext('OS')
    , value: function(device) {
        return device.version || ''
      }
    , compare: function(deviceA, deviceB) {
        var va = (deviceA.version || '0').split('.')
          , vb = (deviceB.version || '0').split('.')
          , la = va.length
          , lb = vb.length

        for (var i = 0, l = Math.max(la, lb); i < l; ++i) {
          var a = i < la ? parseInt(va[i], 10) : 0
            , b = i < lb ? parseInt(vb[i], 10) : 0
            , diff = a - b

          if (diff !== 0) {
            return diff
          }
        }

        return 0
      }
    })
  , network: TextCell({
      title: gettext('Network')
    , value: function(device) {
        return device.phone ? device.phone.network : ''
      }
    })
  , display: TextCell({
      title: gettext('Screen')
    , defaultOrder: 'desc'
    , value: function(device) {
        return device.display
          ? device.display.width + 'x' + device.display.height
          : ''
      }
    , compare: function(deviceA, deviceB) {
        var va = deviceA.display
          ? deviceA.display.width * deviceA.display.height
          : 0
        var vb = deviceB.display
          ? deviceB.display.width * deviceB.display.height
          : 0
        return va - vb
      }
    })
  , serial: TextCell({
      title: gettext('Serial')
    , value: function(device) {
        return device.serial || ''
      }
    })
  , manufacturer: TextCell({
      title: gettext('Manufacturer')
    , value: function(device) {
        return device.manufacturer || ''
      }
    })
  , sdk: NumberCell({
      title: gettext('SDK')
    , defaultOrder: 'desc'
    , value: function(device) {
        return device.sdk || ''
      }
    })
  , abi: TextCell({
      title: gettext('ABI')
    , value: function(device) {
        return device.abi || ''
      }
    })
  , phone: TextCell({
      title: gettext('Phone')
    , value: function(device) {
        return device.phone ? device.phone.phoneNumber : ''
      }
    })
  , imei: TextCell({
      title: gettext('Phone IMEI')
    , value: function(device) {
        return device.phone ? device.phone.imei : ''
      }
    })
  , iccid: TextCell({
      title: gettext('Phone ICCID')
    , value: function(device) {
        return device.phone ? device.phone.iccid : ''
      }
    })
  , batteryHealth: TextCell({
      title: gettext('Battery Health')
    , value: function(device) {
        return device.battery
          ? $filter('translate')(device.enhancedBatteryHealth)
          : ''
      }
    })
  , batterySource: TextCell({
      title: gettext('Battery Source')
    , value: function(device) {
        return device.battery
          ? $filter('translate')(device.enhancedBatterySource)
          : ''
      }
    })
  , batteryStatus: TextCell({
      title: gettext('Battery Status')
    , value: function(device) {
        return device.battery
          ? $filter('translate')(device.enhancedBatteryStatus)
          : ''
      }
    })
  , batteryLevel: TextCell({
      title: gettext('Battery Level')
    , value: function(device) {
        return device.battery
          ? Math.floor(device.battery.level / device.battery.scale * 100) + '%'
          : ''
      }
    })
  , batteryTemp: TextCell({
      title: gettext('Battery Temperature')
    , value: function(device) {
        return device.battery ? device.battery.temp + '°C' : ''
      }
    })
  , provider: TextCell({
      title: gettext('Location')
    , value: function(device) {
        return device.provider ? device.provider.name : ''
      }
    })
  , owner: LinkCell({
      title: gettext('User')
    , target: '_blank'
    , value: function(device) {
        return device.owner ? device.owner.name : ''
      }
    , link: function(device) {
        return device.owner ? device.enhancedUserContactUrl : ''
      }
    })
  }
}

function zeroPadTwoDigit(digit) {
  return digit < 10 ? '0' + digit : '' + digit
}

function compareIgnoreCase(a, b) {
  var la = (a || '').toLowerCase()
    , lb = (b || '').toLowerCase()
  return la === lb ? 0 : (la < lb ? -1 : 1)
}

function compareRespectCase(a, b) {
  return a === b ? 0 : (a < b ? -1 : 1)
}

function TextCell(options) {
  return _.defaults(options, {
    title: options.title
  , defaultOrder: 'asc'
  , build: function () {
      var td = document.createElement('td')
      td.appendChild(document.createTextNode(''))
      return td
    }
  , update: function(td, item) {
      var t = td.firstChild
      t.nodeValue = options.value(item)
      return td
    }
  , compare: function(a, b) {
      return compareIgnoreCase(options.value(a), options.value(b))
    }
  })
}

function NumberCell(options) {
  return _.defaults(options, {
    title: options.title
  , defaultOrder: 'asc'
  , build: function () {
      var td = document.createElement('td')
      td.appendChild(document.createTextNode(''))
      return td
    }
  , update: function(td, item) {
      var t = td.firstChild
      t.nodeValue = options.value(item)
      return td
    }
  , compare: function(a, b) {
      return options.value(a) - options.value(b)
    }
  })
}


function DateCell(options) {
  return _.defaults(options, {
    title: options.title
  , defaultOrder: 'desc'
  , build: function () {
      var td = document.createElement('td')
      td.appendChild(document.createTextNode(''))
      return td
    }
  , update: function(td, item) {
      var t = td.firstChild
        , date = options.value(item)
      if (date) {
        t.nodeValue = date.getFullYear()
          + '-'
          + zeroPadTwoDigit(date.getMonth() + 1)
          + '-'
          + zeroPadTwoDigit(date.getDate())
      }
      else {
        t.nodeValue = ''
      }
      return td
    }
  , compare: function(a, b) {
      var va = options.value(a) || 0
        , vb = options.value(b) || 0
      return va - vb
    }
  })
}

function LinkCell(options) {
  return _.defaults(options, {
    title: options.title
  , defaultOrder: 'asc'
  , build: function () {
      var td = document.createElement('td')
        , a = document.createElement('a')
      a.appendChild(document.createTextNode(''))
      td.appendChild(a)
      return td
    }
  , update: function(td, item) {
      var a = td.firstChild
        , t = a.firstChild
        , href = options.link(item)
      if (href) {
        a.setAttribute('href', href)
      }
      else {
        a.removeAttribute('href')
      }
      a.target = options.target || ''
      t.nodeValue = options.value(item)
      return td
    }
  , compare: function(a, b) {
      return compareIgnoreCase(options.value(a), options.value(b))
    }
  })
}

function DeviceModelCell(options) {
  return _.defaults(options, {
    title: options.title
  , defaultOrder: 'asc'
  , build: function() {
      var td = document.createElement('td')
        , span = document.createElement('span')
        , image = document.createElement('img')
      span.className = 'device-small-image'
      span.appendChild(image)
      td.appendChild(span)
      td.appendChild(document.createTextNode(''))
      return td
    }
  , update: function(td, device) {
      var span = td.firstChild
        , image = span.firstChild
        , t = span.nextSibling
        , src = '/static/devices/icon/x24/' + (device.image || '_default.jpg')
      // Only change if necessary so that we don't trigger a download
      if (image.getAttribute('src') !== src) {
        image.setAttribute('src', src)
      }
      t.nodeValue = options.value(device)
      return td
    }
  , compare: function(a, b) {
      return compareRespectCase(options.value(a), options.value(b))
    }
  })
}

function DeviceStatusCell(options) {
  return _.defaults(options, {
    title: options.title
  , defaultOrder: 'asc'
  , build: function() {
      var td = document.createElement('td')
        , a = document.createElement('a')
      a.appendChild(document.createTextNode(''))
      td.appendChild(a)
      return td
    }
  , update: function(td, device) {
      var a = td.firstChild
        , t = a.firstChild
        , classes = 'btn btn-xs device-status '
      switch (device.state) {
      case 'using':
        a.className = classes + 'btn-primary'
        break
      case 'busy':
        a.className = classes + 'btn-warning'
        break
      case 'available':
      case 'ready':
      case 'present':
        a.className = classes + 'btn-primary-outline'
        break
      case 'preparing':
        a.className = classes + 'btn-primary-outline btn-success-outline'
        break
      case 'unauthorized':
        a.className = classes + 'btn-danger-outline'
        break
      case 'offline':
        a.className = classes + 'btn-warning-outline'
        break
      default:
        a.className = classes + 'btn-default-outline'
        break
      }
      if (device.usable) {
        a.href = '#!/control/' + device.serial
      }
      else {
        a.removeAttribute('href')
      }
      t.nodeValue = options.value(device)
      return td
    }
  , compare: (function() {
      var order = {
        using: 10
      , available: 20
      , busy: 30
      , ready: 40
      , preparing: 50
      , unauthorized: 60
      , offline: 70
      , present: 80
      , absent: 90
      }
      return function(deviceA, deviceB) {
        return order[deviceA.state] - order[deviceB.state]
      }
    })()
  })
}
